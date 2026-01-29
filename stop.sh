#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Остановка проекта Barterswap...${NC}\n"

# Остановка Next.js сервера
echo -e "${YELLOW}Остановка Next.js сервера (порт 3000)...${NC}"
if lsof -ti:3000 > /dev/null 2>&1; then
  lsof -ti:3000 | xargs kill -9 2>/dev/null
  pkill -9 -f "next dev" 2>/dev/null
  pkill -9 -f "next-server" 2>/dev/null
  sleep 1
  if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${RED}✗ Не удалось остановить Next.js сервер${NC}"
  else
    echo -e "${GREEN}✓ Next.js сервер остановлен${NC}"
  fi
else
  echo -e "${GREEN}✓ Next.js сервер не запущен${NC}"
fi

# Остановка Socket.IO сервера
echo -e "${YELLOW}Остановка Socket.IO сервера (порт 3001)...${NC}"
if lsof -ti:3001 > /dev/null 2>&1; then
  lsof -ti:3001 | xargs kill -9 2>/dev/null
  pkill -9 -f "node.*socket-server" 2>/dev/null
  pkill -9 -f "socket-server/index.js" 2>/dev/null
  sleep 1
  if lsof -ti:3001 > /dev/null 2>&1; then
    echo -e "${RED}✗ Не удалось остановить Socket.IO сервер${NC}"
  else
    echo -e "${GREEN}✓ Socket.IO сервер остановлен${NC}"
  fi
else
  echo -e "${GREEN}✓ Socket.IO сервер не запущен${NC}"
fi

echo -e "\n${GREEN}Готово!${NC}\n"
