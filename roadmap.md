# Backend Roadmap

## Статус проекта

**Общий статус:** функциональность backend собрана, архитектура стабилизирована, выполняется подготовка к первому production-деплою.


---

# 1. Архитектура и структура

## Сделано

- [x] Разделены основные слои:
  - `config`;
  - `routes`;
  - `middlewares`;
  - `controllers`;
  - `services`;
  - `models`;
  - `validation`;
  - `utils`;
  - `scripts`.
- [x] Добавлен `asyncHandler`.
- [x] Убраны повторяющиеся `try/catch`.
- [x] Добавлены CRUD-фабрики.
- [x] Добавлены базовые CRUD-контроллеры.
- [x] Создан единый `scripts/bootstrap.js`.
- [x] Public и admin routes разделены.
- [x] Admin routes централизованно защищены.

## Можно улучшить

- [ ] Привести имена файлов к единому стилю.
- [ ] Переименовать `models/Projects.js` в `models/Project.js`.
- [ ] Вынести error codes в `constants/errorCodes.js`.
- [ ] Удалить неиспользуемые imports.
- [ ] Добавить ESLint.
- [ ] Добавить Prettier.
- [ ] После стабилизации API перейти к структуре `src/modules`.


---

# 2. Единый API-контракт

## Сделано

- [x] Создан `utils/sendSuccess.js`.
- [x] Создан `utils/ApiError.js`.
- [x] Создан единый `error.middleware.js`.
- [x] Controllers используют `sendSuccess`.
- [x] Services используют `ApiError`.
- [x] Async-ошибки передаются через `asyncHandler`.
- [x] Zod-ошибки передаются в общий error handler.
- [x] Обрабатываются:
  - Zod errors;
  - Mongoose errors;
  - duplicate key `11000`;
  - JWT errors;
  - invalid ObjectId;
  - route not found.
- [x] Feedback middleware использует единый error flow.
- [x] Feedback route использует порядок:

```text
rate limiter
  -> validation
  -> protection
  -> controller
```

Success response:

```json
{
  "success": true,
  "message": "Проекты получены",
  "data": []
}
```

Error response:

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

## Можно улучшить

- [ ] Удалить неиспользуемую зависимость `http-errors`.
- [ ] Обработать Multer errors.
- [ ] Обработать body parser errors.
- [ ] Обработать CORS errors единообразно.
- [ ] Добавить request ID.
- [ ] Добавить production logger.

---

# 3. Аутентификация и пользователи

## Реализованная функциональность

### Регистрация

```http
POST /api/auth/register
```

- [x] Создание пользователя.
- [x] Проверка уникальности email.
- [x] Проверка уникальности username.
- [x] Валидация данных.
- [x] Хеширование пароля.
- [x] Выдача access token.
- [x] Создание refresh session.

### Login

```http
POST /api/auth/login
```

- [x] Проверка email и пароля.
- [x] Access token через JWT.
- [x] Refresh token в HTTP-only cookie.
- [x] Создание сессии.
- [x] Rate limit попыток входа.

### Сессии и токены

- [x] Access token.
- [x] Refresh token.
- [x] Hash refresh token в MongoDB.
- [x] Refresh token rotation.
- [x] TTL для sessions.
- [x] Logout с удалением текущей сессии.

### Профиль

```http
GET /api/auth/me
PUT /api/auth/me
```

- [x] Получение текущего пользователя.
- [x] Обновление профиля.

### Сброс пароля

```http
POST /api/auth/forgot-password
GET /api/auth/reset-password/:token/verify
POST /api/auth/reset-password
```

- [x] Создание reset token.
- [x] Hash reset token.
- [x] Отправка email.
- [x] Проверка token.
- [x] Изменение пароля.
- [x] Удаление старых сессий.
- [x] TTL reset token.

### Admin access

- [x] `protect` middleware.
- [x] `adminOnly` middleware.
- [x] Проверка роли `admin`.
- [x] Защита всех `/api/admin/*` routes.

## Можно улучшить

- [ ] Добавить отдельную Zod schema для `PUT /api/auth/me`.
- [ ] Вынести auth validation из controller в routes.
- [ ] Сделать refresh rotation атомарным.
- [ ] Проверить параллельные refresh-запросы.
- [ ] Добавить список активных сессий.
- [ ] Добавить logout со всех устройств.
- [ ] Ограничить количество активных сессий.


## Email verification

### Сделано

- [x] В User есть поле `isVerified`.
- [x] `isVerified` передаётся в JWT.
- [x] Email используется для восстановления пароля.

### Нужно сделать

- [ ] Создать `EmailVerificationCode` model.
- [ ] Генерировать 6-значный код.
- [ ] Хранить код только в виде hash.
- [ ] Добавить TTL на 10 минут.
- [ ] Добавить `POST /api/auth/verify-email`.
- [ ] Добавить `POST /api/auth/resend-verification`.
- [ ] Запрещать login неподтверждённому пользователю.
- [ ] Добавить rate limit повторной отправки.
- [ ] Ограничить количество попыток ввода кода.
- [ ] Добавить `verifiedOnly` middleware.
- [ ] Отправлять verification email после регистрации.
- [ ] Добавить tests verification flow.

---

# 4. Projects API

## Public API

```http
GET /api/projects
GET /api/projects/:slug
GET /api/projects/statuses
GET /api/projects/filters
```

Реализовано:

- [x] Получение списка публичных проектов.
- [x] Получение проекта по slug.
- [x] Фильтрация через `is_public: true`.
- [x] Поиск по title.
- [x] Поиск по short description.
- [x] Фильтр по project status.
- [x] Фильтр по technology.
- [x] Фильтр по favorite.
- [x] Получение активных project statuses.
- [x] Получение project filters.
- [x] Populate status, technologies и categories.

## Admin API

```http
GET    /api/admin/projects
GET    /api/admin/projects/:id
POST   /api/admin/projects
PUT    /api/admin/projects/:id
DELETE /api/admin/projects/:id
```

Реализовано:

- [x] Получение всех проектов.
- [x] Получение проекта по ID для edit-модалки.
- [x] Создание проекта.
- [x] Обновление проекта.
- [x] Удаление проекта.
- [x] Проверка project status при создании.
- [x] Проверка project status при обновлении.
- [x] Проверка технологий при создании.
- [x] Удаление старого изображения при замене.
- [x] Удаление изображения при удалении проекта.

## Можно улучшить

- [ ] Проверять технологии также при обновлении.
- [ ] Проверять активность технологий.
- [ ] Проверять активность project status.
- [ ] Добавить pagination.
- [ ] Добавить pagination metadata.
- [ ] Ограничить максимальный `limit`.
- [ ] Улучшить поиск.
- [ ] Добавить compound indexes.
- [ ] Проверить duplicate slug.
- [ ] Проверить orphan images.

Примеры pagination:

```http
GET /api/projects?page=1&limit=6
GET /api/admin/projects?page=1&limit=20
```

---

# 5. Technologies API

## Public API

```http
GET /api/technology
GET /api/technology/:id
```

Реализовано:

- [x] Получение технологий.
- [x] Populate category.
- [x] Сортировка по order и name.
- [x] Public method для активных технологий.

## Admin API

```http
GET    /api/admin/technology
POST   /api/admin/technology
PUT    /api/admin/technology/:id
DELETE /api/admin/technology/:id
```

Реализовано:

- [x] Получение всех технологий.
- [x] Создание технологии.
- [x] Обновление технологии.
- [x] Удаление технологии.
- [x] Проверка существования категории.
- [x] Validation через Zod.

## Можно улучшить

- [ ] Проверить, что public `GET /:id` не возвращает inactive technology.
- [ ] Запретить использование inactive technology в новых проектах.
- [ ] Решить поведение при удалении технологии, которая используется в проектах.
- [ ] Добавить pagination/search для admin списка.

---

# 6. Technology Categories API

## Public API

```http
GET /api/categoriesOfTechnology
```

## Admin API

```http
GET    /api/admin/categoriesOfTechnology
GET    /api/admin/categoriesOfTechnology/:id
POST   /api/admin/categoriesOfTechnology
PUT    /api/admin/categoriesOfTechnology/:id
DELETE /api/admin/categoriesOfTechnology/:id
```

Реализовано:

- [x] CRUD категорий.
- [x] Validation.
- [x] Уникальные name и slug.
- [x] Цвет категории.
- [x] Icon категории.
- [x] Запрет удаления категории с технологиями.
- [x] Error code `CATEGORY_NOT_EMPTY`.

## Можно улучшить

- [ ] Public API должен возвращать только активные категории.
- [ ] Проверить duplicate slug.
- [ ] Добавить tests.
- [ ] Добавить pagination при росте количества категорий.


---

# 7. Experience API

## Public API

```http
GET /api/experience
```

Реализовано:

- [x] Получение видимого опыта.
- [x] Сортировка по order и датам.
- [x] Populate technologies.
- [x] Фильтр через `isVisible: true`.

## Admin API

```http
GET    /api/admin/experience
GET    /api/admin/experience/:id
POST   /api/admin/experience
PUT    /api/admin/experience/:id
DELETE /api/admin/experience/:id
```

Реализовано:

- [x] Получение всех записей.
- [x] Создание.
- [x] Обновление.
- [x] Удаление.
- [x] Скрытие записи.
- [x] Изменение порядка.

## Можно улучшить

- [ ] Добавить Zod validation.
- [ ] Проверять technology IDs.
- [ ] Добавить tests.

---

# 8. Education API

## Public API

```http
GET /api/education
```

## Admin API

```http
GET    /api/admin/education
GET    /api/admin/education/:id
POST   /api/admin/education
PUT    /api/admin/education/:id
DELETE /api/admin/education/:id
```

Реализовано:

- [x] Public выдача видимых записей.
- [x] Admin CRUD.
- [x] Скрытие записи через `isVisible`.
- [x] Сортировка по датам и order.

## Можно улучшить

- [ ] Добавить Zod validation.
- [ ] Добавить tests.
- [ ] Проверить корректность partial update.

---

# 9. Languages API

## Public API

```http
GET /api/languages
```

## Admin API

```http
GET    /api/admin/languages
GET    /api/admin/languages/:id
POST   /api/admin/languages
PUT    /api/admin/languages/:id
DELETE /api/admin/languages/:id
```

Реализовано:

- [x] Public выдача видимых языков.
- [x] Admin CRUD.
- [x] Поля name, code, level, description.
- [x] Сортировка по order.
- [x] Скрытие через `isVisible`.

## Можно улучшить

- [ ] Добавить Zod validation.
- [ ] Проверить уникальность language code.
- [ ] Добавить tests.


---

# 10. Settings API

## Public API

```http
GET /api/settings
```

Возвращает:

- profile;
- location;
- experience years;
- availability status;
- contacts;
- feedback settings.

## Admin API

```http
PUT /api/admin/settings
```

Реализовано:

- [x] Получение settings.
- [x] Обновление settings.
- [x] Validation settings.
- [x] Проверка availability status.
- [x] Создание Settings через bootstrap.
- [x] ApiError для Settings.

## Можно улучшить

- [ ] Убрать `cvUrl` из settings schema.
- [ ] Проверить partial update вложенных объектов.
- [ ] Проверять только активные availability statuses.
- [ ] Гарантировать один Settings document.
- [ ] Добавить tests.

---

# 11. Feedback API

## Public API

```http
POST /api/feedback
```

Цепочка:

```text
rate limiter
  -> validation
  -> honeypot
  -> time protection
  -> duplicate check
  -> save
  -> email notification
  -> response
```

Реализовано:

- [x] Public feedback form.
- [x] Zod validation.
- [x] Rate limiter.
- [x] Honeypot.
- [x] Проверка времени заполнения.
- [x] Cooldown по email.
- [x] Duplicate protection.
- [x] Email notification.
- [x] Единый success/error response.

## Admin API

```http
GET    /api/admin/feedback
GET    /api/admin/feedback/:id
PATCH  /api/admin/feedback/:id/status
POST   /api/admin/feedback/:id/reply
DELETE /api/admin/feedback/:id
```

Реализовано:

- [x] Список feedback.
- [x] Pagination fields в service.
- [x] Search.
- [x] Фильтр по status.
- [x] Получение feedback по ID.
- [x] Автоматическая отметка `read`.
- [x] Изменение status.
- [x] Reply через email.
- [x] Удаление feedback.

## Можно улучшить

- [ ] Добавить validation для pagination.
- [ ] Ограничить search query.
- [ ] Добавить IP-based cooldown.
- [ ] Решить поведение при ошибке email.
- [ ] Добавить email queue.
- [ ] Добавить tests.

---

# 12. Upload API

## Admin API

```http
POST   /api/admin/upload/cv
DELETE /api/admin/upload/cv
POST   /api/admin/upload/project-image
```

Реализовано:

- [x] Загрузка CV.
- [x] Удаление CV.
- [x] Загрузка project image.
- [x] PDF validation.
- [x] Image MIME validation.
- [x] Ограничение размера.
- [x] Удаление старого CV.
- [x] Удаление старого project image.
- [x] Static `/uploads`.

## Можно улучшить

- [ ] Перевести relative paths на absolute paths.
- [ ] Удалять новый файл при ошибке БД.
- [ ] Добавить orphan file cleanup.
- [ ] Проверить права на uploads.
- [ ] Настроить persistent storage.
- [ ] Перейти на S3, Cloudinary или Supabase Storage.


---

# 13. Bootstrap и база данных

## При запуске создаются или проверяются

```text
availabilitystatuses
projectstatuses
settings
admin user
```

Порядок:

```text
config/env
  -> connectDB
  -> bootstrap
  -> app.listen
```

Реализовано:

- [x] Availability statuses через `upsert`.
- [x] Project statuses через `upsert`.
- [x] Settings создаётся при отсутствии.
- [x] Admin создаётся при отсутствии.
- [x] Повторный запуск не создаёт дубликаты.
- [x] Bootstrap логирует этапы.
- [x] MongoDB закрывается при shutdown.
- [x] Старые seed-файлы удалены.

## Нужно проверить

- [ ] Чистая MongoDB.
- [ ] Повторный запуск.
- [ ] Конфликт admin email.
- [ ] Отсутствующие admin env.
- [ ] Ошибка MongoDB.
- [ ] TTL indexes.
- [ ] Unique indexes.
- [ ] MongoDB backups.


---

# 14. Public filtering и безопасность данных

## Нужно проверить

- [ ] Public technologies возвращает только `isActive: true`.
- [ ] Public categories возвращает только активные категории.
- [ ] Public availability statuses возвращает только активные статусы.
- [ ] Public technology by ID не возвращает inactive technology.
- [ ] Public project filters учитывают только public projects.
- [ ] Технологии из private projects не попадают в public filters.
- [ ] Public experience фильтруется по `isVisible`.
- [ ] Public education фильтруется по `isVisible`.
- [ ] Public languages фильтруется по `isVisible`.
- [ ] Admin API недоступен без access token.
- [ ] Admin API недоступен пользователю без роли admin.

---

# 15. Validation

## Сделано

- [x] Projects validation.
- [x] Technologies validation.
- [x] Categories validation.
- [x] Availability statuses validation.
- [x] Feedback validation.
- [x] Admin feedback validation.
- [x] Settings validation.

## Нужно сделать

- [ ] Profile update validation.
- [ ] Experience validation.
- [ ] Education validation.
- [ ] Language validation.
- [ ] Projects query validation.
- [ ] Feedback query validation.
- [ ] MongoDB ID validation.
- [ ] Общий middleware для `body`, `params`, `query`.
- [ ] Ограничение `page`.
- [ ] Ограничение `limit`.
- [ ] Максимальный `limit`.


---

# 16. Pagination и поиск

## Нужно сделать

- [ ] Pagination для public projects.
- [ ] Pagination для admin projects.
- [ ] Pagination для admin feedback.
- [ ] Pagination metadata.
- [ ] Ограничение максимального `limit`.
- [ ] Ограничение длины search.
- [ ] Проверка производительности regex.
- [ ] Выбор `$text`, Atlas Search или regex.
- [ ] Compound indexes.
- [ ] Отдельная сортировка public/admin.

Примеры:

```http
GET /api/projects?page=1&limit=6
GET /api/admin/projects?page=1&limit=20
GET /api/admin/feedback?page=1&limit=20
```

---

# 17. Production configuration

## Нужно сделать

- [ ] Проверить `.env.example`.
- [ ] Не хранить `.env` в Git.
- [ ] Проверить production MongoDB URI.
- [ ] Использовать разные JWT secrets.
- [ ] Использовать длинные случайные secrets.
- [ ] Настроить production `CLIENT_URL`.
- [ ] Настроить production cookies.
- [ ] Настроить HTTPS.
- [ ] Проверить CORS credentials.
- [ ] Настроить SMTP.
- [ ] Разделить admin email и feedback notification email.
- [ ] Настроить MongoDB backups.
- [ ] Настроить process manager.
- [ ] Настроить health check.

Для cross-site frontend/backend:

```js
sameSite: "none",
secure: true
```

Frontend:

```js
withCredentials: true
```

---

# 18. Тестирование

Сейчас test runner не настроен.

## Нужно сделать

- [ ] Выбрать test runner.
- [ ] Добавить unit tests.
- [ ] Добавить integration tests.
- [ ] Добавить test database.
- [ ] Протестировать bootstrap.
- [ ] Протестировать auth.
- [ ] Протестировать refresh rotation.
- [ ] Протестировать admin permissions.
- [ ] Протестировать public/private filtering.
- [ ] Протестировать project CRUD.
- [ ] Протестировать validation.
- [ ] Протестировать error middleware.
- [ ] Протестировать feedback.
- [ ] Протестировать uploads.
- [ ] Протестировать email flow.

---

# 19. Deployment

## Local

```bash
npm install
npm start
```

## Production

```bash
npm ci
npm start
```

Перед deploy:

- [ ] Создать MongoDB Atlas cluster.
- [ ] Создать database user.
- [ ] Настроить Network Access.
- [ ] Настроить production env.
- [ ] Настроить HTTPS.
- [ ] Настроить CORS.
- [ ] Настроить cookies.
- [ ] Настроить SMTP.
- [ ] Настроить persistent storage.
- [ ] Настроить backups.
- [ ] Проверить cold start.
- [ ] Проверить повторный запуск.
- [ ] Проверить admin login.
- [ ] Проверить public API.
- [ ] Проверить admin API.

Health check:

```http
GET /api
```

---

# Ближайший план

## Этап 1 — фактическая проверка

- [ ] Запустить проект.
- [ ] Проверить `/api`.
- [ ] Проверить bootstrap.
- [ ] Проверить admin login.
- [ ] Проверить public projects.
- [ ] Проверить admin projects.
- [ ] Проверить feedback.
- [ ] Проверить uploads.

## Этап 2 — security gaps

- [ ] Проверить public filtering.
- [ ] Добавить profile validation.
- [ ] Добавить query и params validation.
- [ ] Проверить production cookies.
- [ ] Проверить upload storage.

## Этап 3 — производительность

- [ ] Добавить pagination.
- [ ] Улучшить search.
- [ ] Добавить compound indexes.
- [ ] Ограничить query parameters.

## Этап 4 — production

- [ ] Настроить MongoDB Atlas.
- [ ] Настроить SMTP.
- [ ] Настроить uploads storage.
- [ ] Настроить HTTPS.
- [ ] Настроить backups.
- [ ] Выполнить первый deploy.

## Этап 5 — качество

- [ ] Добавить tests.
- [ ] Добавить ESLint.
- [ ] Добавить Prettier.
- [ ] Добавить logger.
- [ ] Добавить CI/CD.

---

# Критерий готовности

Backend готов к production, когда:

- [ ] `npm start` проходит на чистой базе;
- [ ] повторный запуск не создаёт дубликаты;
- [ ] bootstrap создаёт системные данные;
- [ ] admin может войти;
- [ ] public API не раскрывает private/inactive данные;
- [ ] admin API защищён;
- [ ] все основные API-модули проверены;
- [ ] ответы API единообразны;
- [ ] feedback работает;
- [ ] uploads сохраняются после redeploy;
- [ ] SMTP работает;
- [ ] MongoDB backups настроены;
- [ ] есть базовые integration tests.