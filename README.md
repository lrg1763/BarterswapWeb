# Barterswap Web

Проект создан в **учебных целях**. Это демонстрационное приложение для изучения современного веб-разработки на Next.js и React.

---

## О проекте

**Barterswap** — веб-приложение для обмена навыками: пользователи могут находить друг друга по умениям и договариваться об обмене знаниями или услугами.

Реализовано на **Next.js 14** с App Router, TypeScript и Tailwind CSS.

---

## Стек технологий

- **Next.js 14** — React-фреймворк с серверным рендерингом
- **React 18** — UI-библиотека
- **TypeScript** — типизация
- **Tailwind CSS** — стилизация
- **Framer Motion** — анимации
- **Lucide React** — иконки
- **Sonner** — уведомления (toast)

---

## Требования

- Node.js 18+
- npm или yarn

---

## Установка и запуск

**Установка зависимостей:**

```bash
npm install
```

**Режим разработки:**

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

**Сборка (статический экспорт):**

```bash
npm run build
```

Результат — папка `out/`, которую можно раздавать любым статическим хостингом.

**Дополнительные команды:**

- `npm run lint` — проверка кода (ESLint)
- `npm run format` — форматирование кода (Prettier)

---

## Деплой на GitHub Pages

Проект настроен на публикацию на GitHub Pages через GitHub Actions.

1. Залейте репозиторий на GitHub.
2. В репозитории: **Settings → Pages → Build and deployment** выберите **Source: GitHub Actions**.
3. При пуше в ветку `main` workflow соберёт сайт и задеплоит его.

Сайт будет доступен по адресу: `https://<ваш-username>.github.io/BarterswapWeb/`

Если имя репозитория другое — в `next.config.js` замените `BarterswapWeb` в `basePath` и `assetPrefix` на имя вашего репозитория.

---

## Структура проекта

- `app/` — страницы и маршруты (App Router)
- `components/` — переиспользуемые компоненты
- `public/` — статические файлы
- Конфигурация: `next.config.js`, `tailwind.config.js`, `tsconfig.json`

---

## Лицензия

Учебный проект. Использование — на усмотрение автора.
