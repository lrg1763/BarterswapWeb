import { Server } from 'socket.io'
import { createServer } from 'http'
import jwt from 'jsonwebtoken'
import { createRequire } from 'module'

// Используем require для импорта Prisma Client из корня проекта
const require = createRequire(import.meta.url)
const { PrismaClient } = require('../node_modules/@prisma/client')

const prisma = new PrismaClient()

const PORT = process.env.SOCKET_PORT || 3001
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', process.env.NEXTAUTH_URL || 'http://localhost:3000'].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
})

// Middleware для аутентификации
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error('Authentication error: No token provided'))
    }

    // Если токен - это просто ID (для упрощения в dev режиме)
    if (typeof token === 'string' && /^\d+$/.test(token)) {
      // Проверяем, существует ли пользователь
      const user = await prisma.user.findUnique({
        where: { id: parseInt(token) },
        select: { id: true },
      })

      if (!user) {
        return next(new Error('Authentication error: User not found'))
      }

      socket.userId = token
      return next()
    }

    // Иначе пытаемся декодировать JWT
    try {
      const decoded = jwt.verify(token, NEXTAUTH_SECRET)
      socket.userId = decoded.id || decoded.sub || decoded.userId

      if (!socket.userId) {
        return next(new Error('Authentication error: Invalid token'))
      }

      next()
    } catch (jwtError) {
      // Если не JWT, проверяем как ID пользователя
      const user = await prisma.user.findUnique({
        where: { id: parseInt(token) },
        select: { id: true },
      })

      if (!user) {
        return next(new Error('Authentication error: Invalid token'))
      }

      socket.userId = token
      next()
    }
  } catch (error) {
    console.error('Authentication error:', error)
    next(new Error('Authentication error: Invalid token'))
  }
})

io.on('connection', async (socket) => {
  const userId = parseInt(socket.userId)

  console.log(`User ${userId} connected`)

  // Обновляем статус онлайн
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isOnline: true,
        lastSeen: new Date(),
      },
    })

    // Присоединяемся к комнате пользователя
    const userRoom = `user_${userId}`
    socket.join(userRoom)

    // Уведомляем всех, что пользователь онлайн
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true },
    })
    
    socket.broadcast.emit('user_online', {
      user_id: userId,
      username: user?.username || 'Unknown',
    })
  } catch (error) {
    console.error('Error updating online status:', error)
  }

  // Присоединение к комнате пользователя
  socket.on('join_room', async (data) => {
    try {
      const { room_id } = data
      socket.join(room_id)
      console.log(`User ${userId} joined room ${room_id}`)
    } catch (error) {
      console.error('Error joining room:', error)
    }
  })

  // Отправка сообщения
  socket.on('send_message', async (data) => {
    console.log('Received send_message event:', { userId, data })
    try {
      const { receiver_id, message } = data

      console.log('Processing message:', { senderId: userId, receiver_id, messageLength: message?.length })

      if (!receiver_id || !message || message.length === 0 || message.length > 2000) {
        console.error('Invalid message data:', { receiver_id, messageLength: message?.length })
        socket.emit('error', { message: 'Invalid message data' })
        return
      }

      const receiverId = parseInt(receiver_id)
      
      if (isNaN(receiverId)) {
        console.error('Invalid receiver_id:', receiver_id)
        socket.emit('error', { message: 'Invalid receiver ID' })
        return
      }
      
      console.log('Message validation passed, checking blocks...')

      // Проверяем блокировку
      const isBlocked = await prisma.block.findFirst({
        where: {
          OR: [
            { blockerId: userId, blockedId: receiverId },
            { blockerId: receiverId, blockedId: userId },
          ],
        },
      })

      if (isBlocked) {
        socket.emit('error', { message: 'Cannot send message to blocked user' })
        return
      }

      // Создаем сообщение в БД
      console.log('Creating message in DB...')
      const newMessage = await prisma.message.create({
        data: {
          senderId: userId,
          receiverId,
          content: message,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      })
      
      console.log('Message created in DB:', { messageId: newMessage.id, senderId: newMessage.senderId, receiverId })

      // Отправляем сообщение получателю
      const receiverRoom = `user_${receiverId}`
      console.log('Sending message to receiver room:', receiverRoom)
      io.to(receiverRoom).emit('receive_message', {
        id: newMessage.id,
        sender_id: newMessage.senderId,
        sender_name: newMessage.sender.username,
        receiver_id: receiverId,
        content: newMessage.content,
        timestamp: newMessage.timestamp,
        is_read: false,
      })

      // Отправляем подтверждение отправителю
      console.log('Sending confirmation to sender')
      socket.emit('message_sent', {
        id: newMessage.id,
        timestamp: newMessage.timestamp,
      })

      // Обновляем список чатов для обоих пользователей
      const unreadCount = await prisma.message.count({
        where: {
          receiverId,
          senderId: userId,
          isRead: false,
          isDeleted: false,
        },
      })

      io.to(receiverRoom).emit('new_message_notification', {
        sender_name: newMessage.sender.username,
        preview: message.substring(0, 50),
        unread_count: unreadCount,
      })
    } catch (error) {
      console.error('Error sending message:', error)
      console.error('Error stack:', error.stack)
      socket.emit('error', { 
        message: 'Error sending message',
        error: error.message 
      })
    }
  })

  // Индикатор печати
  socket.on('typing', async (data) => {
    try {
      const { receiver_id, is_typing } = data
      const receiverId = parseInt(receiver_id)

      const sender = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
      })

      const receiverRoom = `user_${receiverId}`
      io.to(receiverRoom).emit('user_typing', {
        user_id: userId,
        username: sender?.username,
        is_typing: is_typing || false,
      })
    } catch (error) {
      console.error('Error handling typing:', error)
    }
  })

  // Редактирование сообщения
  socket.on('edit_message', async (data) => {
    try {
      const { message_id, content } = data

      if (!content || content.length === 0 || content.length > 2000) {
        socket.emit('error', { message: 'Invalid message content' })
        return
      }

      // Проверяем, что сообщение принадлежит пользователю
      const message = await prisma.message.findUnique({
        where: { id: parseInt(message_id) },
        include: {
          sender: true,
          receiver: true,
        },
      })

      if (!message) {
        socket.emit('error', { message: 'Message not found' })
        return
      }

      if (message.senderId !== userId) {
        socket.emit('error', { message: 'Unauthorized' })
        return
      }

      // Обновляем сообщение
      const updatedMessage = await prisma.message.update({
        where: { id: parseInt(message_id) },
        data: {
          content,
          isEdited: true,
          editedAt: new Date(),
        },
      })

      // Отправляем обновление обоим пользователям
      const senderRoom = `user_${message.senderId}`
      const receiverRoom = `user_${message.receiverId}`

      io.to(senderRoom).emit('message_edited', {
        message_id: parseInt(message_id),
        content: updatedMessage.content,
        edited_at: updatedMessage.editedAt,
      })

      io.to(receiverRoom).emit('message_edited', {
        message_id: parseInt(message_id),
        content: updatedMessage.content,
        edited_at: updatedMessage.editedAt,
      })
    } catch (error) {
      console.error('Error editing message:', error)
      socket.emit('error', { message: 'Error editing message' })
    }
  })

  // Удаление сообщения
  socket.on('delete_message', async (data) => {
    try {
      const { message_id } = data

      // Проверяем, что сообщение принадлежит пользователю
      const message = await prisma.message.findUnique({
        where: { id: parseInt(message_id) },
      })

      if (!message) {
        socket.emit('error', { message: 'Message not found' })
        return
      }

      if (message.senderId !== userId) {
        socket.emit('error', { message: 'Unauthorized' })
        return
      }

      // Soft delete сообщения
      await prisma.message.update({
        where: { id: parseInt(message_id) },
        data: {
          isDeleted: true,
        },
      })

      // Отправляем уведомление обоим пользователям
      const senderRoom = `user_${message.senderId}`
      const receiverRoom = `user_${message.receiverId}`

      io.to(senderRoom).emit('message_deleted', {
        message_id: parseInt(message_id),
      })

      io.to(receiverRoom).emit('message_deleted', {
        message_id: parseInt(message_id),
      })
    } catch (error) {
      console.error('Error deleting message:', error)
      socket.emit('error', { message: 'Error deleting message' })
    }
  })

  // Обновление статуса онлайн
  socket.on('update_online_status', async () => {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          lastSeen: new Date(),
        },
      })
    } catch (error) {
      console.error('Error updating online status:', error)
    }
  })

  // Heartbeat для поддержания соединения
  const heartbeat = setInterval(async () => {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          lastSeen: new Date(),
        },
      })
    } catch (error) {
      console.error('Heartbeat error:', error)
    }
  }, 30000) // Каждые 30 секунд

  // Отключение
  socket.on('disconnect', async () => {
    console.log(`User ${userId} disconnected`)
    
    // Останавливаем heartbeat
    clearInterval(heartbeat)

    try {
      // Обновляем статус офлайн
      await prisma.user.update({
        where: { id: userId },
        data: {
          isOnline: false,
          lastSeen: new Date(),
        },
      })

      // Уведомляем всех, что пользователь офлайн
      socket.broadcast.emit('user_offline', {
        user_id: userId,
      })
    } catch (error) {
      console.error('Error updating offline status:', error)
    }
  })
})

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  httpServer.close(() => {
    prisma.$disconnect()
    process.exit(0)
  })
})
