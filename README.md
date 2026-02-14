# Zaklad.ua API

B2B платформа для ресторанного бізнесу та HoReCa в Україні.

## Опис

Zaklad.ua — це професійна B2B-платформа, яка містить каталоги, рейтинги, порівняння та відгуки закладів і цифрових рішень для ресторанного бізнесу.

## Технологічний стек

- **Backend**: NestJS (Node.js)
- **База даних**: PostgreSQL
- **ORM**: Prisma
- **Аутентифікація**: JWT + Passport
- **Документація API**: Swagger/OpenAPI
- **Мови**: Українська (uk), Російська (ru)

## Встановлення

### Передумови

- Node.js 18+
- PostgreSQL 14+
- npm або yarn

### Кроки встановлення

1. **Клонуйте репозиторій**

```bash
git clone https://github.com/your-repo/zaklad-ua.git
cd zaklad-ua
```

2. **Встановіть залежності**

```bash
npm install
```

3. **Налаштуйте змінні середовища**

Скопіюйте `.env.example` в `.env` та налаштуйте:

```bash
cp .env.example .env
```

Відредагуйте `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/zaklad_ua?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
APP_PORT=3000
```

4. **Згенеруйте Prisma клієнт**

```bash
npm run prisma:generate
```

5. **Застосуйте міграції**

```bash
npm run prisma:migrate
```

6. **Заповніть базу тестовими даними (опційно)**

```bash
npm run prisma:seed
```

7. **Запустіть сервер**

```bash
npm run start:dev
```

Сервер буде доступний на `http://localhost:3000`

## API Документація

Swagger документація доступна за адресою:
```
http://localhost:3000/api/docs
```

## Структура проєкту

```
zaklad-ua/
├── prisma/
│   ├── schema.prisma      # Схема бази даних
│   └── seed.ts            # Seed дані
├── src/
│   ├── common/            # Спільні утиліти
│   │   ├── decorators/    # Кастомні декоратори
│   │   ├── filters/       # Фільтри помилок
│   │   ├── guards/        # Guards
│   │   └── interfaces/    # Інтерфейси
│   ├── config/            # Конфігурація
│   ├── i18n/              # Локалізація
│   │   ├── uk/            # Українська
│   │   └── ru/            # Російська
│   ├── modules/
│   │   ├── auth/          # Аутентифікація
│   │   ├── users/         # Користувачі
│   │   ├── establishments/ # Заклади
│   │   ├── pos-systems/   # POS-системи
│   │   ├── categories/    # Категорії
│   │   ├── reviews/       # Відгуки
│   │   └── ratings/       # Рейтинги
│   ├── prisma/            # Prisma сервіс
│   ├── app.module.ts      # Головний модуль
│   └── main.ts            # Точка входу
└── package.json
```

## API Ендпоінти

### Аутентифікація

| Метод | Ендпоінт | Опис |
|-------|----------|------|
| POST | `/api/v1/auth/register` | Реєстрація користувача |
| POST | `/api/v1/auth/register/business` | Реєстрація бізнесу |
| POST | `/api/v1/auth/login` | Вхід в систему |
| GET | `/api/v1/auth/me` | Поточний користувач |

### Заклади

| Метод | Ендпоінт | Опис |
|-------|----------|------|
| GET | `/api/v1/establishments` | Список закладів |
| GET | `/api/v1/establishments/:idOrSlug` | Деталі закладу |
| POST | `/api/v1/establishments` | Створити заклад (Business) |
| PATCH | `/api/v1/establishments/:id` | Оновити заклад (Business) |
| DELETE | `/api/v1/establishments/:id` | Видалити заклад |
| GET | `/api/v1/establishments/compare` | Порівняння закладів |

### POS-системи

| Метод | Ендпоінт | Опис |
|-------|----------|------|
| GET | `/api/v1/pos-systems` | Список POS-систем |
| GET | `/api/v1/pos-systems/:idOrSlug` | Деталі POS-системи |
| POST | `/api/v1/pos-systems` | Створити POS-систему (Business) |
| PATCH | `/api/v1/pos-systems/:id` | Оновити POS-систему (Business) |
| DELETE | `/api/v1/pos-systems/:id` | Видалити POS-систему |
| GET | `/api/v1/pos-systems/compare` | Порівняння систем |

### Відгуки та рейтинги

| Метод | Ендпоінт | Опис |
|-------|----------|------|
| GET | `/api/v1/reviews/establishment/:id` | Відгуки закладу |
| GET | `/api/v1/reviews/pos-system/:id` | Відгуки POS-системи |
| POST | `/api/v1/reviews` | Додати відгук |
| POST | `/api/v1/ratings` | Додати/оновити рейтинг |
| GET | `/api/v1/ratings/stats/establishment/:id` | Статистика рейтингу |

## Ролі користувачів

- **GUEST** — Перегляд публічного контенту
- **USER** — Залишати відгуки, рейтинги, зберігати обране
- **BUSINESS** — Управління закладами та POS-системами
- **ADMIN** — Повний доступ, модерація

## Мультимовність

API підтримує українську та російську мови. Передайте мову через:

- Query параметр: `?lang=uk` або `?lang=ru`
- Header: `x-lang: uk` або `x-lang: ru`
- Accept-Language header

## Фільтрація та пошук

Приклад запиту з фільтрами:

```
GET /api/v1/establishments?businessType=RESTAURANT&cityId=xxx&minRating=4&page=1&limit=10&lang=uk
```

## Тестові акаунти

Після запуску seed:

| Email | Пароль | Роль |
|-------|--------|------|
| admin@zaklad.ua | admin123456 | ADMIN |
| user@example.com | user123456 | USER |
| business@example.com | business123456 | BUSINESS |

## Скрипти

```bash
npm run start:dev     # Запуск в режимі розробки
npm run start:prod    # Запуск продакшн
npm run build         # Збірка проєкту
npm run prisma:migrate # Міграції БД
npm run prisma:seed   # Заповнення тестовими даними
npm run prisma:studio # Prisma Studio (GUI для БД)
```

## Ліцензія

MIT

