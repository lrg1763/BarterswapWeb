# Быстрый запуск проекта SkillSwap

## Шаг 1: Создайте файл .env.local

Создайте файл `.env.local` в корне проекта:

```bash
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skillswap?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="skillswap-development-secret-key-change-in-production-2024"
NEXT_PUBLIC_SOCKET_SERVER_URL="http://localhost:3001"
SOCKET_PORT=3001
NODE_ENV="development"
EOF
```

**⚠️ ВАЖНО**: Замените `DATABASE_URL` на ваши реальные данные PostgreSQL!

## Шаг 2: Настройте базу данных

```bash
# Создайте базу данных (если еще не создана)
createdb skillswap

# Или через psql:
psql postgres
CREATE DATABASE skillswap;
\q

# Генерируйте Prisma Client
npm run db:generate

# Примените миграции
npm run db:migrate

# Или просто отправьте схему в БД:
npm run db:push
```

## Шаг 3: Установите зависимости для socket-server

```bash
cd socket-server
npm install
# Скопируйте .env.local в .env
cp ../.env.local .env
cd ..
```

## Шаг 4: Запустите проект

**Терминал 1:**
```bash
npm run dev
```

**Терминал 2:**
```bash
npm run dev:socket
```

## Готово! 

Откройте браузер: http://localhost:3000

---

## Альтернатива: Используйте скрипты

```bash
# Автоматический запуск Next.js
./start.sh

# В другом терминале - Socket.IO
cd socket-server && ./start.sh
```
