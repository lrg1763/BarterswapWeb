#!/bin/bash

echo "Запуск Socket.IO сервера на порту 3001..."
cd "$(dirname "$0")"

# Проверка наличия .env
if [ ! -f .env ]; then
    echo "ОШИБКА: Файл .env не найден!"
    echo "Скопируйте .env.local из корня проекта в socket-server/.env"
    exit 1
fi

# Проверка зависимостей
if [ ! -d "node_modules" ]; then
    echo "Установка зависимостей..."
    npm install
fi

# Запуск сервера
node index.js
