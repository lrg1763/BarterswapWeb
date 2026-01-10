#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Запуск проекта SkillSwap...${NC}\n"

# Проверка наличия .env.local
if [ ! -f .env.local ]; then
    echo -e "${RED}ОШИБКА: Файл .env.local не найден!${NC}"
    echo -e "${YELLOW}Создайте файл .env.local на основе инструкций в START_PROJECT.md${NC}"
    exit 1
fi

# Проверка зависимостей
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Установка зависимостей...${NC}"
    npm install
fi

# Генерация Prisma Client
echo -e "${YELLOW}Генерация Prisma Client...${NC}"
npm run db:generate

# Установка зависимостей для socket-server
if [ ! -d "socket-server/node_modules" ]; then
    echo -e "${YELLOW}Установка зависимостей для socket-server...${NC}"
    cd socket-server && npm install && cd ..
fi

# Копирование .env.local в socket-server/.env если нужно
if [ ! -f "socket-server/.env" ]; then
    echo -e "${YELLOW}Создание .env для socket-server...${NC}"
    cp .env.local socket-server/.env
fi

echo -e "\n${GREEN}Готово к запуску!${NC}\n"
echo -e "${YELLOW}Запуск Next.js сервера на http://localhost:3000${NC}"
echo -e "${YELLOW}Для Socket.IO сервера откройте новый терминал и выполните: npm run dev:socket${NC}\n"

# Запуск Next.js dev server
npm run dev
