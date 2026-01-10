# Настройка Socket.IO сервера

Socket.IO сервер работает как отдельный процесс для обработки реал-тайм коммуникации в чате.

## Установка

1. Установите зависимости в папке socket-server:

```bash
cd socket-server
npm install
cd ..
```

## Конфигурация

Создайте файл `.env` в папке `socket-server/` (или скопируйте `.env.example`):

```env
SOCKET_PORT=3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/skillswap?schema=public
```

**Важно**: `NEXTAUTH_SECRET` и `DATABASE_URL` должны совпадать с настройками основного проекта (файл `.env.local`).

## Запуск

### Режим разработки:

```bash
# В корне проекта
npm run dev:socket
```

### Продакшен:

```bash
cd socket-server
npm start
```

Или используйте процесс-менеджер (PM2):

```bash
pm2 start socket-server/index.js --name skillswap-socket
```

## Порт

По умолчанию Socket.IO сервер запускается на порту 3001. Вы можете изменить его через переменную окружения `SOCKET_PORT`.

## Аутентификация

Socket.IO сервер использует JWT токены для аутентификации. Токен передается клиентом при подключении через `handshake.auth.token`.

## События

### Клиент -> Сервер:
- `join_room` - Присоединение к комнате
- `send_message` - Отправка сообщения
- `typing` - Индикатор печати
- `edit_message` - Редактирование сообщения
- `delete_message` - Удаление сообщения
- `update_online_status` - Обновление статуса онлайн

### Сервер -> Клиент:
- `receive_message` - Получение нового сообщения
- `user_typing` - Уведомление о печати
- `message_edited` - Уведомление об редактировании
- `message_deleted` - Уведомление об удалении
- `user_online` - Пользователь стал онлайн
- `user_offline` - Пользователь стал офлайн
- `new_message_notification` - Уведомление о новом сообщении
- `error` - Ошибка

## Логирование

Сервер выводит логи в консоль:
- Подключение/отключение пользователей
- Ошибки обработки событий
- Ошибки подключения к БД

## Graceful Shutdown

Сервер корректно обрабатывает сигнал SIGTERM для graceful shutdown.
