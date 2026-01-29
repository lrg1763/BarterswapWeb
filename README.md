# Barterswap

Платформа для peer-to-peer обмена навыками и услугами без использования денег. Современное веб-приложение с реальным временем для связи между пользователями.

![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-black)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-black)

## Особенности

- Регистрация и аутентификация (NextAuth.js v5)
- Профили пользователей с загрузкой аватаров
- Поиск пользователей по навыкам и местоположению
- Реал-тайм чат (Socket.IO)
- Отзывы и рейтинги
- Избранное и блокировка пользователей
- Валидация данных (Zod), безопасность (CSRF, XSS, rate limiting)

## Технологический стек

**Frontend**: Next.js 14+ (App Router), TypeScript, React 18.3+, Tailwind CSS, React Hook Form, Framer Motion

**Backend**: PostgreSQL, Prisma 5.19+, NextAuth.js v5, Socket.IO, Zod, bcryptjs

## Требования

- Node.js 18+
- PostgreSQL 15+
- npm/yarn/pnpm

## Быстрый старт

### 1. Установка зависимостей
```bash
npm install
cd socket-server && npm install && cd ..
```

### 2. Настройка PostgreSQL
```bash
# macOS
brew install postgresql@15 && brew services start postgresql@15

# Создание БД
psql postgres
CREATE DATABASE barterswap;
\q
```

### 3. Настройка переменных окружения
Создайте `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/barterswap?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-min-32-chars"  # openssl rand -base64 32
NEXT_PUBLIC_SOCKET_SERVER_URL="http://localhost:3001"
SOCKET_PORT="3001"
NODE_ENV="development"
```

### 4. Инициализация БД
```bash
npm run db:generate
npm run db:migrate
```

### 5. Запуск
```bash
# Автоматический запуск (рекомендуется)
./start.sh
# или
npm run dev:full

# Ручной запуск
npm run dev          # Терминал 1 - Next.js
npm run dev:socket   # Терминал 2 - Socket.IO
```

Приложение доступно на:
- **Next.js**: http://localhost:3000
- **Socket.IO**: http://localhost:3001

## Команды

```bash
npm run dev          # Next.js dev сервер
npm run dev:socket   # Socket.IO сервер
npm run dev:full     # Запуск всего проекта
npm run build        # Сборка для продакшена
npm run db:generate  # Генерация Prisma Client
npm run db:migrate   # Применение миграций
npm run db:studio    # Prisma Studio
npm stop             # Остановка всех серверов
```

## Безопасность

Реализовано: Rate Limiting, CSRF/XSS защита, Brute Force Protection, валидация паролей, Security Headers, Input Validation (Zod), SQL Injection Protection (Prisma).

Для продакшена: Redis для rate limiting, HTTPS, мониторинг, регулярные обновления зависимостей.

## API Endpoints

**Аутентификация**: `POST /api/auth/register`, `POST /api/auth/[...nextauth]`

**Пользователи**: `GET /api/users/me`, `GET /api/users/[id]`, `PUT /api/users/me`, `POST /api/users/me/avatar`, `GET /api/users/search`

**Сообщения**: `GET /api/messages/chat/[userId]`, `GET /api/messages`

**Отзывы**: `GET /api/reviews/user/[userId]`, `POST /api/reviews`

**Избранное**: `GET /api/favorites`, `POST /api/favorites`, `DELETE /api/favorites/[userId]`

## База данных

Модели: User, Message, Review, Favorite, Block. Схема в [prisma/schema.prisma](./prisma/schema.prisma)

## Socket.IO

**Клиент → Сервер**: `join_room`, `send_message`, `typing`, `edit_message`, `delete_message`, `update_online_status`

**Сервер → Клиент**: `receive_message`, `user_typing`, `message_edited`, `message_deleted`, `user_online/offline`, `new_message_notification`

**Важно**: `NEXTAUTH_SECRET` и `DATABASE_URL` в `socket-server/.env` должны совпадать с `.env.local`.

## Лицензия

Проект является частным и защищен авторским правом.

