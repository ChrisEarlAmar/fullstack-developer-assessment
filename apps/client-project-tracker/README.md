# Client Project Tracker application

This directory is the runnable Laravel + React application for the [Client Project Tracker assessment](../../README.md). It is a self-contained adaptation of the supplied Laravel + React boilerplate: Laravel provides the JSON API and database layer, while React provides the browser experience.

## Prerequisites

- PHP 8.3 or newer (PHP 8.4 recommended)
- Composer 2
- Node.js 22.12 or newer and npm 10.9 or newer
- MySQL and the `pdo_mysql` PHP extension

Run every command below from this directory. The committed Composer dependencies require PHP 8.3 or above; PHP 8.2 is not supported.

## Install and run

In PowerShell:

```powershell
composer install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
php artisan key:generate
php artisan migrate --seed
npm ci
composer run dev
```

The default `.env.example` connects to MySQL at `127.0.0.1:3306` using database `cea_fullstack_test`, user `root`, and an empty password. Create that database in MySQL before running the migration, or update the `DB_*` values to use a different local database. Visit `http://127.0.0.1:8000` after the development processes start. `composer run dev` starts the Laravel development server, queue listener, log viewer, and Vite development server together.

To run the servers separately, use `php artisan serve` in one terminal and `npm run dev` in another, then visit Laravel’s URL (normally `http://127.0.0.1:8000`).

### Reset local data

The following command deletes and recreates the configured MySQL schema, then re-imports the fixture. Use it only when resetting local development data is intended:

```powershell
php artisan migrate:fresh --seed
```

## Seeded fixture

`php artisan migrate --seed` imports the 12 supplied assessment projects. The source fixture remains at the repository root as [`../../test_data.json`](../../test_data.json); the application carries a seeder copy so it remains runnable when copied independently.

The seed preserves IDs 1 through 12 and maps fixture camelCase keys to the database’s snake_case columns. Re-running the seeder is idempotent, which makes local resets predictable.

## API contract

All API routes are prefixed with `/api`. This is intentional: `/projects` is a React browser route, while `/api/projects` is the server resource.

| Method   | Path                 | Result                                            |
| -------- | -------------------- | ------------------------------------------------- |
| `GET`    | `/api/projects`      | Returns the project collection.                   |
| `GET`    | `/api/projects/{id}` | Returns one project or a JSON `404`.              |
| `POST`   | `/api/projects`      | Creates a project and returns `201`.              |
| `PUT`    | `/api/projects/{id}` | Fully updates a project and returns `200`.        |
| `DELETE` | `/api/projects/{id}` | Deletes a project and returns `204` with no body. |

### List controls

The list endpoint supports these optional assessment-bonus query parameters:

| Parameter   | Accepted values                                                           | Meaning                           |
| ----------- | ------------------------------------------------------------------------- | --------------------------------- |
| `search`    | Text                                                                      | Matches client and project names. |
| `status`    | `Planning`, `In Progress`, `On Hold`, `Completed`                         | Filters by status.                |
| `priority`  | `Low`, `Medium`, `High`                                                   | Filters by priority.              |
| `sort`      | `clientName`, `projectName`, `status`, `priority`, `startDate`, `dueDate` | Selects the sort field.           |
| `direction` | `asc`, `desc`                                                             | Selects sort direction.           |
| `page`      | Positive integer                                                          | Selects a result page.            |
| `perPage`   | Integer from `1` to `100`                                                 | Results per page; defaults to 20. |

For example: `/api/projects?status=In%20Progress&priority=High&sort=dueDate&direction=asc&page=1&perPage=20`.

Collection responses include Laravel pagination metadata (`current_page`, `last_page`, `per_page`, `from`, `to`, and `total`) in their top-level `meta` object.

### Project representation

Requests and responses use camelCase field names. A create or update request has this shape:

```json
{
  "clientName": "Acme Corporation",
  "projectName": "Corporate Website Redesign",
  "description": "Redesign and modernize the company's corporate website.",
  "status": "In Progress",
  "priority": "High",
  "startDate": "2026-06-01",
  "dueDate": "2026-07-15"
}
```

Responses add an `id` and use the same field names. Laravel API resources wrap a single project or a project collection in a top-level `data` property. Dates are calendar dates in `YYYY-MM-DD` format; they do not include a timestamp.

| Field         | Type             | Rules                                                       |
| ------------- | ---------------- | ----------------------------------------------------------- |
| `id`          | integer          | Generated identifier; present in responses.                 |
| `clientName`  | string           | Required.                                                   |
| `projectName` | string           | Required.                                                   |
| `description` | string or `null` | Optional.                                                   |
| `status`      | string           | Required; one of Planning, In Progress, On Hold, Completed. |
| `priority`    | string           | Required; one of Low, Medium, High.                         |
| `startDate`   | date string      | Required; `YYYY-MM-DD`.                                     |
| `dueDate`     | date string      | Required; `YYYY-MM-DD` and not earlier than `startDate`.    |

`PUT` is a complete replacement operation: all required fields must be supplied, while `description` may be omitted or set to `null`.

### Errors

Invalid input returns HTTP `422` with a meaningful message and field-level errors keyed by the camelCase API field name. For example, a due date before the start date returns an error under `errors.dueDate`. Requests for an unknown resource return a JSON `404`.

## Application design

```text
app/
  Http/Controllers/       REST controller
  Http/Requests/          Create, update, and list validation
  Http/Resources/         CamelCase API representation
  Models/                 Project model and backed enums
database/
  migrations/             projects table schema
  seeders/                supplied-project fixture import
resources/ts/
  components/             reusable interface components
  pages/                  project list and form experience
  features/projects/      typed API client, types, and helpers
routes/api.php            Project API routes
routes/web.php            SPA shell and browser-route fallback
tests/Feature/            API and seed behavior coverage
```

The database uses snake_case fields (`client_name`, `start_date`, and so on), while request objects and API resources create a deliberate camelCase boundary for the React client. Status, priority, and sortable fields are allow-listed; query values are mapped to known database columns rather than being passed directly to a query.

The interface presents the requested CRUD workflow and adds small usability improvements: searchable and filterable projects, sortable results, responsive presentation, confirmation before deletion, and clear success or error feedback. These enhancements remain intentionally lightweight for the assessment’s small data set.

## Verification

Run the full verification set after installing dependencies:

```powershell
composer run check-platform
composer test
npm run lint
npm run format:check
npm run typecheck
npm run build
```

Laravel feature tests use an isolated in-memory test database and cover the REST contract, validation failures, date ordering, unknown IDs, seed data, and CRUD behavior. The frontend toolchain checks type safety, linting, formatting, and production buildability.

Optional dependency-maintenance checks are:

```powershell
composer audit --locked
npm audit --audit-level=high
```

## Scope and next steps

The focus is a clear, maintainable CRUD implementation rather than a broad product surface. Authentication, roles, audit logs, file uploads, deployment, pagination, and Docker are not required for this assessment. A production evolution would add authorization, server-side pagination and query indexing for larger collections, audit history, monitoring, and a deployment pipeline.

## AI assistance disclosure

AI-assisted tooling (Codex) was used to help inspect the starter, implement and iterate on the application, tests, and documentation. The resulting work was reviewed; run the documented verification commands before submission.
