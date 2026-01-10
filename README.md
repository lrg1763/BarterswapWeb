# SkillSwap

Платформа для peer-to-peer обмена навыками и услугами без использования денег.

## Технологии

- **Framework**: Next.js 14+ (App Router)
- **Язык**: TypeScript
- **База данных**: PostgreSQL + Prisma ORM
- **Аутентификация**: NextAuth.js v5
- **Реал-тайм**: Socket.IO
- **Стилизация**: Tailwind CSS
- **Валидация**: Zod + React Hook Form

## Установка

### 1. Клонирование и установка зависимостей

```bash
npm install
```

### 2. Настройка базы данных

Следуйте инструкциям в файле [DATABASE_SETUP.md](./DATABASE_SETUP.md)

### 3. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/skillswap?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NEXT_PUBLIC_SOCKET_SERVER_URL="http://localhost:3001"
NODE_ENV="development"
```

Для генерации `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Инициализация базы данных

```bash
# Генерация Prisma Client
npm run db:generate

# Создание и применение миграций
npm run db:migrate

# Или просто отправка схемы в БД (для разработки)
npm run db:push
```

## Запуск

### Быстрый старт

1. **Создайте файл `.env.local`** в корне проекта (см. [START_PROJECT.md](./START_PROJECT.md))

2. **Настройте PostgreSQL** (см. [DATABASE_SETUP.md](./DATABASE_SETUP.md))

3. **Запустите проект:**

   **Вариант 1 - Автоматический скрипт:**
   ```bash
   ./start.sh
   ```
   
   **Вариант 2 - Вручную:**
   ```bash
   # Терминал 1 - Next.js сервер
   npm run dev
   
   # Терминал 2 - Socket.IO сервер
   npm run dev:socket
   ```

**Важно**: 
- Socket.IO сервер должен быть запущен отдельно для работы чата
- Установите зависимости для socket-server: `cd socket-server && npm install && cd ..`
- Создайте `.env.local` файл перед запуском (см. [START_PROJECT.md](./START_PROJECT.md))

Приложение будет доступно на http://localhost:3000

### Продакшен

```bash
npm run build
npm start
```

## Структура проекта

```
skillswap-nextjs/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Страницы аутентификации
│   ├── (protected)/       # Защищенные страницы
│   ├── api/               # API Routes
│   └── layout.tsx         # Root layout
├── components/            # React компоненты
│   ├── ui/               # UI компоненты
│   ├── layout/           # Компоненты layout
│   ├── chat/             # Компоненты чата
│   └── user/             # Компоненты пользователя
├── lib/                   # Утилиты и хелперы
│   ├── db.ts             # Prisma client
│   ├── auth.ts           # NextAuth конфигурация
│   └── validations.ts    # Zod схемы
├── prisma/                # Prisma схема и миграции
├── socket-server/         # Socket.IO сервер
└── public/                # Статические файлы
```

## Команды

- `npm run dev` - Запуск dev сервера
- `npm run build` - Сборка для продакшена
- `npm run start` - Запуск продакшен сервера
- `npm run lint` - Проверка кода ESLint
- `npm run format` - Форматирование кода Prettier
- `npm run db:generate` - Генерация Prisma Client
- `npm run db:migrate` - Применение миграций
- `npm run db:studio` - Открыть Prisma Studio
- `npm run db:push` - Отправить схему в БД (без миграций)

## Текущий статус

✅ Этап 1: Инициализация проекта и базовая структура  
✅ Этап 2: Настройка базы данных (Prisma + PostgreSQL)  
✅ Этап 3: Настройка аутентификации (NextAuth.js v5)  
⏳ Этап 4: Страницы аутентификации (login/register)  
⏳ Этап 5: Главная страница и базовый layout  

## Документация

- [Настройка базы данных](./DATABASE_SETUP.md)
- [Промпт проекта](./PROMPT_FOR_NEXTJS.md)
