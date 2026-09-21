# Portfolio Backend

Backend API для персонального сайта-портфолио.

## Возможности

- публичное API портфолио;
- административное API;
- JWT-аутентификация;
- access и refresh tokens;
- роли пользователей;
- управление проектами;
- управление технологиями и категориями;
- опыт работы, образование и языки;
- настройки сайта;
- feedback с email-уведомлениями;
- загрузка CV и изображений;
- автоматическая инициализация MongoDB.

## Стек

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- Zod
- Multer
- Nodemailer
- Helmet
- express-rate-limit
- bcryptjs

## Требования

- Node.js 20+
- MongoDB или MongoDB Atlas
- SMTP-сервер для email-функций

## Установка

```bash
npm install
```

## Переменные окружения

Создайте файл `.env` в корне backend:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/portfolio

JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me

CLIENT_URL=http://localhost:5173

ADMIN_EMAIL=admin@example.com

ADMIN_USERNAME=portfolio_admin
ADMIN_USER_EMAIL=admin@example.com
ADMIN_USER_PASSWORD=change_this_strong_password

SMTP_URL=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_LOGIN=your_login
SMTP_PASSWORD=your_password
```

Для production обязательно используйте уникальные секретные значения.

Не добавляйте `.env` в Git.

## Запуск

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## Инициализация базы данных

При запуске приложения автоматически выполняется bootstrap:

1. подключение к MongoDB;
2. создание или обновление availability statuses;
3. создание или обновление project statuses;
4. создание Settings, если их ещё нет;
5. создание admin-пользователя, если его ещё нет;
6. запуск HTTP-сервера.

Bootstrap является idempotent: повторный запуск не создаёт дубликаты.

```text
connectDB
  -> bootstrap
  -> app.listen
```

На чистой базе автоматически создаются:

- availability statuses;
- project statuses;
- Settings;
- admin user.

Остальные коллекции появляются при первой записи в них.

## Архитектура

```text
Request
  -> global middleware
  -> route middleware
  -> validation/auth
  -> asyncHandler
  -> controller
  -> service
  -> Mongoose model
  -> sendSuccess
```

Ошибки проходят через единый обработчик:

```text
ApiError/ZodError/Mongoose/JWT
  -> asyncHandler или next()
  -> error.middleware
  -> unified error response
```

### Назначение слоёв

- `routes` — описание URL и middleware;
- `middlewares` — авторизация, validation, rate limit и обработка ошибок;
- `controllers` — HTTP-слой;
- `services` — бизнес-логика;
- `models` — схемы MongoDB;
- `validation` — схемы Zod;
- `utils` — общие вспомогательные функции;
- `scripts/bootstrap.js` — первоначальная и повторная инициализация базы.

## Структура проекта

```text
backend/
├── config/
│   ├── db.js
│   └── env.js
├── constants/
├── controllers/
│   ├── base/
│   └── ...
├── middlewares/
├── models/
├── routes/
│   ├── public/
│   ├── admin/
│   └── auth.routes.js
├── scripts/
│   └── bootstrap.js
├── services/
│   ├── base/
│   └── ...
├── uploads/
├── utils/
└── validation/
```

## Формат успешного ответа

```json
{
  "success": true,
  "message": "Проект создан",
  "data": {
    "id": "123",
    "title": "Portfolio"
  }
}
```

## Формат ошибки

```json
{
  "success": false,
  "message": "Проект не найден",
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "details": null
  }
}
```

## Ошибка валидации

```json
{
  "success": false,
  "message": "Ошибка валидации",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Неверный формат email"
      }
    ]
  }
}
```

## Аутентификация

### Access token

Передаётся в заголовке:

```http
Authorization: Bearer ACCESS_TOKEN
```

### Refresh token

Refresh token хранится в HTTP-only cookie:

```text
refreshToken
```

Refresh token:

- не возвращается в JSON;
- хранится в cookie;
- в MongoDB сохраняется только hash;
- при обновлении выполняется rotation.

### Admin API

Все маршруты `/api/admin/*` требуют:

1. валидный access token;
2. роль `admin`.

## API

### Health check

```http
GET /api
```

### Auth

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
PUT  /api/auth/me
POST /api/auth/forgot-password
GET  /api/auth/reset-password/:token/verify
POST /api/auth/reset-password
```

### Public API

```http
GET  /api/projects
GET  /api/projects/:slug
GET  /api/projects/statuses
GET  /api/projects/filters

GET  /api/technology
GET  /api/technology/:id
GET  /api/categoriesOfTechnology
GET  /api/availabilityStatuses

GET  /api/experience
GET  /api/education
GET  /api/languages
GET  /api/settings

POST /api/feedback
```

### Admin API

```http
GET    /api/admin/projects
GET    /api/admin/projects/:id
POST   /api/admin/projects
PUT    /api/admin/projects/:id
DELETE /api/admin/projects/:id

GET    /api/admin/technology
POST   /api/admin/technology
PUT    /api/admin/technology/:id
DELETE /api/admin/technology/:id

GET    /api/admin/feedback
GET    /api/admin/feedback/:id
PATCH  /api/admin/feedback/:id/status
POST   /api/admin/feedback/:id/reply
DELETE /api/admin/feedback/:id

PUT    /api/admin/settings

POST   /api/admin/upload/cv
DELETE /api/admin/upload/cv
POST   /api/admin/upload/project-image
```

Все admin endpoints требуют роль `admin`.

## MongoDB

Основные коллекции:

```text
users
sessions
resetpwdtokens
settings
projects
projectstatuses
technologies
technologycategories
availabilitystatuses
experiences
educations
languages
feedbacks
```

TTL-коллекции:

- `sessions`;
- `resetpwdtokens`.

MongoDB автоматически удаляет просроченные документы по полю `expiresAt`.

## Uploads

Локальные загрузки хранятся в:

```text
uploads/
├── cv/
├── profile/
└── projects/
```

Для production рекомендуется использовать постоянное или внешнее хранилище:

- Amazon S3;
- Cloudinary;
- Supabase Storage;
- persistent disk хостинга.

## Deployment

1. Создайте MongoDB Atlas cluster.
2. Создайте database user.
3. Разрешите IP production-сервера.
4. Настройте environment variables.
5. Установите зависимости:

```bash
npm ci
```

6. Запустите приложение:

```bash
npm start
```

7. Проверьте health endpoint:

```http
GET /api
```

После запуска bootstrap автоматически создаст системные данные и admin-пользователя.

## Production checklist

- [ ] используются реальные JWT secrets;
- [ ] `.env` не добавлен в Git;
- [ ] MongoDB разрешает IP production-сервера;
- [ ] `CLIENT_URL` указывает на production frontend;
- [ ] frontend использует `withCredentials: true`;
- [ ] настроены SMTP-переменные;
- [ ] настроено постоянное хранилище uploads;
- [ ] admin password не хранится в Git;
- [ ] включён HTTPS;
- [ ] проверены refresh cookies;
- [ ] проверены admin routes;
- [ ] настроены резервные копии MongoDB.

## Scripts

```bash
npm run dev
npm start
```

Тесты пока не настроены.

## Roadmap

- добавить integration tests;
- добавить pagination для проектов и feedback;
- добавить OpenAPI/Swagger;
- вынести uploads во внешнее хранилище;
- добавить production logging;
- добавить CI/CD pipeline.

## License

Private project.