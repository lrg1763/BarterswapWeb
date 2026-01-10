# Инструкция по запуску проекта

## Быстрый старт

### 1. Создайте файл .env.local

Создайте файл `.env.local` в корне проекта со следующим содержимым:

```env
# Database - ЗАМЕНИТЕ НА ВАШИ ДАННЫЕ PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skillswap?schema=public"

# NextAuth - SECRET можно сгенерировать командой: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="skillswap-development-secret-key-change-in-production-2024"

# Socket.IO Server
NEXT_PUBLIC_SOCKET_SERVER_URL="http://localhost:3001"
SOCKET_PORT=3001

# Node Environment
NODE_ENV="development"
```

**Важно**: Замените `DATABASE_URL` на ваши реальные данные подключения к PostgreSQL.

### 2. Настройте базу данных PostgreSQL

Следуйте инструкциям в файле [DATABASE_SETUP.md](./DATABASE_SETUP.md)

### 3. Установите зависимости для socket-server

```bash
cd socket-server
npm install
cd ..
```

### 4. Создайте .env файл для socket-server

Скопируйте `.env.local` в `socket-server/.env` или создайте файл `socket-server/.env` с теми же переменными.

### 5. Сгенерируйте Prisma Client

```bash
npm run db:generate
```

### 6. Примените миграции базы данных

```bash
# Если база данных уже создана
npm run db:migrate

# Или просто отправьте схему в БД (для разработки)
npm run db:push
```

### 7. Запустите проект

**Терминал 1 - Next.js сервер:**
```bash
npm run dev
```

**Терминал 2 - Socket.IO сервер:**
```bash
npm run dev:socket
```

Приложение будет доступно на:
- **Next.js**: http://localhost:3000
- **Socket.IO**: http://localhost:3001

## Проверка работы

1. Откройте браузер и перейдите на http://localhost:3000
2. Зарегистрируйте нового пользователя
3. Войдите в систему
4. Начните использовать платформу!

## Устранение проблем

### Ошибка подключения к базе данных
- Убедитесь, что PostgreSQL запущен
- Проверьте `DATABASE_URL` в `.env.local`
- Убедитесь, что база данных `skillswap` создана

### Ошибка Prisma Client
```bash
npm run db:generate
```

### Ошибка Socket.IO подключения
- Убедитесь, что Socket.IO сервер запущен (`npm run dev:socket`)
- Проверьте `NEXT_PUBLIC_SOCKET_SERVER_URL` в `.env.local`
- Проверьте `SOCKET_PORT` и `NEXTAUTH_SECRET` в обоих `.env` файлах

### Порт уже занят
- Измените порт в `.env.local` (например, `PORT=3001` для Next.js)
- Или остановите процесс, использующий порт

## Дополнительные команды

```bash
# Открыть Prisma Studio (визуальный редактор БД)
npm run db:studio

# Проверить код на ошибки
npm run lint

# Форматировать код
npm run format

# Сборка для продакшена
npm run build
```
