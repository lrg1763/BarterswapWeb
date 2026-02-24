/**
 * Общая конфигурация навигации и ссылок welcome-страницы.
 */

export const NAV_ITEMS = [
  { id: 'features', label: 'Инструкция' },
  { id: 'advantages', label: 'Преимущества' },
  { id: 'examples', label: 'Примеры' },
  { id: 'technologies', label: 'Технологии' },
  { id: 'faq', label: 'FAQ' },
] as const

export const AUTH_LINKS = {
  register: '#',
  login: '#',
} as const
