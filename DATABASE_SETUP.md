# Настройка базы данных

## Шаг 1: Установка PostgreSQL

Если у вас еще не установлен PostgreSQL:

### macOS (через Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Windows:
Скачайте и установите с официального сайта: https://www.postgresql.org/download/windows/

## Шаг 2: Создание базы данных

```bash
# Подключитесь к PostgreSQL
psql postgres

# Создайте базу данных
CREATE DATABASE skillswap;

# Создайте пользователя (опционально)
CREATE USER skillswap_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE skillswap TO skillswap_user;
\q
```

## Шаг 3: Настройка .env файла

Создайте файл `.env.local` в корне проекта со следующим содержимым:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/skillswap?schema=public"

# NextAuth - Сгенерируйте SECRET командой: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Socket.IO Server
SOCKET_SERVER_URL="http://localhost:3001"

# Node Environment
NODE_ENV="development"
```

**Замените:**
- `user` - на ваше имя пользователя PostgreSQL
- `password` - на ваш пароль
- `your-secret-key-here` - на сгенерированный секретный ключ

## Шаг 4: Генерация Prisma Client и миграция

```bash
# Установите зависимости (если еще не установлены)
npm install

# Сгенерируйте Prisma Client
npm run db:generate

# Создайте и примените миграции
npm run db:migrate

# Или просто отправьте схему в БД (для разработки)
npm run db:push
```

## Шаг 5: Проверка подключения

```bash
# Откройте Prisma Studio для просмотра данных
npm run db:studio
```

Prisma Studio откроется в браузере на http://localhost:5555
