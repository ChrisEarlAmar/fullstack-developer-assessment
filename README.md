# Client Project Tracker

A full-stack technical-assessment solution for a digital agency to track client projects, their progress, and their priority. The runnable Laravel + React application lives in [`apps/client-project-tracker`](apps/client-project-tracker/README.md).

The assessment overview uses the phrase “Task Management,” but the detailed [requirements](REQUIREMENTS.md), project model, and supplied fixture define a **Client Project Tracker**. This solution follows those detailed requirements.

## Included functionality

- List all client projects in a responsive interface.
- Create, view, edit, and delete projects.
- Enforce required values, allowed status/priority values, date format, and date order at the API boundary.
- Return clear JSON validation and not-found errors.
- Seed the supplied 12-project fixture for an immediately usable local environment.
- Add optional assessment enhancements: text search, status/priority filters, sorting, 20-entry pagination, delete confirmation, and success/error feedback.

Authentication, Docker, and deployment are intentionally outside the required assessment scope.

## Technology choices

- **Backend:** Laravel 13, PHP 8.3+, Eloquent, request validation, and MySQL.
- **Frontend:** React 19, TypeScript, React Router, Vite, Tailwind CSS, and the supplied shadcn-style component foundation.
- **Testing:** Laravel feature tests with an isolated in-memory database, plus type, lint, formatting, and production-build checks.

Laravel owns the database schema, validation, REST API, and JSON representation. React owns browser routing, interaction state, forms, and the user interface. This keeps presentation concerns separate from persistence and makes the application easier to extend.

## Repository layout

```text
apps/
  client-project-tracker/   Runnable Laravel + React application
REQUIREMENTS.md             Supplied assessment requirements
SUBMISSION.md               Supplied submission guide
test_data.json              Supplied source fixture
```

The [application README](apps/client-project-tracker/README.md) contains the detailed installation guide, API contract, schema, and verification steps.

## Quick start

From the repository root in PowerShell:

```powershell
Set-Location apps/client-project-tracker
composer install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
php artisan key:generate
php artisan migrate --seed
npm ci
composer run dev
```

Open `http://127.0.0.1:8000` after the development processes start. `composer run dev` starts Laravel, Vite, the queue listener, and the log viewer together.

The application requires PHP 8.3+, Composer 2, Node.js 22.12+, npm 10.9+, MySQL, and the `pdo_mysql` PHP extension. The default `.env.example` is configured for local MySQL at `127.0.0.1:3306`, database `cea_fullstack_test`, user `root`, and an empty password. PHP 8.4 is the recommended runtime.

## API summary

The API uses Laravel’s conventional `/api` prefix so it does not collide with the React browser route at `/projects`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects` | List projects; optional search, filters, and sorting. |
| `GET` | `/api/projects/{id}` | Retrieve one project. |
| `POST` | `/api/projects` | Create a project. |
| `PUT` | `/api/projects/{id}` | Replace a project. |
| `DELETE` | `/api/projects/{id}` | Delete a project. |

Project request and response fields use camelCase: `clientName`, `projectName`, `description`, `status`, `priority`, `startDate`, and `dueDate`. The database uses snake_case internally. See the [full API contract](apps/client-project-tracker/README.md#api-contract) for the payload, query parameters, and error behavior.

## Verification

Run these commands from `apps/client-project-tracker` after installation:

```powershell
composer run check-platform
composer test
npm run lint
npm run format:check
npm run typecheck
npm run build
```

Optional dependency checks are:

```powershell
composer audit --locked
npm audit --audit-level=high
```

## Technical decisions and tradeoffs

MySQL provides a familiar local relational database for this assessment, while Laravel migrations keep schema changes repeatable across environments. The supplied fixture is small, so the application can offer a straightforward interaction model while still exposing search, filters, and sorting. A production-scale tracker would add server-side pagination, authorization and roles, audit history, richer search, observability, and production observability.

The API deliberately accepts and returns camelCase fields because this matches the supplied JSON fixture and gives the TypeScript client a natural contract. Request objects, API resources, and allow-listed sort mappings make that boundary explicit and prevent client input from becoming raw database column names.

## AI assistance disclosure

AI-assisted tooling (Codex) was used to inspect the supplied starter and help implement and iterate on the application, tests, and documentation. The resulting work was reviewed; run the documented verification commands before submission.

## Submission

Make this repository publicly accessible, then submit its GitHub URL and the requested technical reflection through the official form referenced in [SUBMISSION.md](SUBMISSION.md).
