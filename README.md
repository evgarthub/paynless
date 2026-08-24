# Paynless

A lightweight utility bills tracker with Home Assistant integration. Track fixed and consumption-based utilities, manage tariff rates with audit history, and submit bills using manual input, live HA sensor readings, or historical estimates.

## Features

- **Utility Management** — Define utilities as FIXED (flat fee) or CONSUMPTION (metered) with optional Home Assistant entity mapping
- **Tariff Auditability** — Versioned rate schedules with effective dates and optional reference URLs for source verification
- **3-Way Bill Input** — For each consumption utility, choose per line item:
  - **Manual** — Direct numerical entry
  - **Home Assistant** — On-demand fetch from `GET /api/states/{entity_id}`
  - **Estimated** — Projected reading from historical daily average
- **Bill Overview** — Monthly bills with per-utility cost breakdown and PAID/UNPAID toggle
- **HA Notifications** — Monthly cron job that posts reminders to Home Assistant's mobile app
- **Single Container** — Docker image based on `oven/bun:alpine` with persistent SQLite storage

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | [Bun](https://bun.sh) |
| Backend | [Hono](https://hono.dev) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) with SQLite (`bun:sqlite`) |
| Frontend | [React](https://react.dev) + [Vite](https://vitejs.dev) + TypeScript + [Tailwind CSS](https://tailwindcss.com) |
| Deployment | Docker (`oven/bun:alpine`) |

## Project Structure

```
paynless/
├── server/
│   ├── src/
│   │   ├── index.ts              # Hono server entry
│   │   ├── db/
│   │   │   ├── schema.ts         # Drizzle ORM schema
│   │   │   ├── index.ts          # DB connection
│   │   │   └── migrate.ts        # Migration runner
│   │   ├── routes/
│   │   │   ├── utilities.ts      # Utility CRUD
│   │   │   ├── tariffs.ts        # Tariff rate CRUD
│   │   │   ├── bills.ts          # Bill creation & management
│   │   │   └── readings.ts       # HA & estimation endpoints
│   │   ├── services/
│   │   │   ├── ha.ts             # Home Assistant REST client
│   │   │   ├── estimation.ts     # Historical average engine
│   │   │   └── cron.ts           # Monthly notification worker
│   │   └── types.ts
│   ├── drizzle/                  # Generated migrations
│   └── drizzle.config.ts
├── web/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── api/client.ts         # API client
│   │   ├── types/index.ts
│   │   └── components/
│   │       ├── Bills/            # Bill list + create modal + 3-way selector
│   │       ├── Utilities/        # Utility manager + form
│   │       └── Tariffs/          # Tariff rate manager + form
│   └── index.html
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0 or later
- (Optional) [Home Assistant](https://www.home-assistant.io) instance with a long-lived access token

### Local Development

```bash
# Clone the repo
git clone https://github.com/evgarthub/paynless.git
cd paynless

# Install dependencies
cd server && bun install && cd ..
cd web && bun install && cd ..

# Generate Drizzle migration
cd server && bun run db:generate && cd ..

# Start both server and web in watch mode
bun run dev
```

The API runs on `http://localhost:3000` and the frontend on `http://localhost:5173` (with API proxy).

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/utilities` | List all utilities |
| `POST` | `/api/utilities` | Create utility |
| `PUT` | `/api/utilities/:id` | Update utility |
| `DELETE` | `/api/utilities/:id` | Delete utility |
| `GET` | `/api/tariffs` | List tariff rates (filter by `?utilityId=`) |
| `GET` | `/api/tariffs/current/:utilityId` | Get active tariff for a utility |
| `POST` | `/api/tariffs` | Create tariff rate |
| `PUT` | `/api/tariffs/:id` | Update tariff rate |
| `DELETE` | `/api/tariffs/:id` | Delete tariff rate |
| `GET` | `/api/bills` | List all bills |
| `GET` | `/api/bills/:id` | Get bill with line items |
| `POST` | `/api/bills` | Create bill with items |
| `PATCH` | `/api/bills/:id/status` | Toggle PAID/UNPAID |
| `DELETE` | `/api/bills/:id` | Delete bill |
| `GET` | `/api/readings/ha/:utilityId` | Fetch live HA sensor value |
| `GET` | `/api/readings/estimate/:utilityId` | Get estimated reading |
| `GET` | `/docs` | Swagger UI |

## Deployment

### Docker

```bash
# Build and run
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `DB_PATH` | `./data/paynless.db` | SQLite database file path |
| `HA_URL` | — | Home Assistant base URL (e.g. `http://homeassistant.local:8123`) |
| `HA_TOKEN` | — | Long-lived access token for HA |
| `HA_NOTIFY_SERVICE` | `mobile_app` | HA notify service name |
| `CRON_SCHEDULE` | `0 9 1 * *` | Cron expression for monthly reminder (default: 1st of month at 9 AM) |

### TrueNAS SCALE

1. Copy `docker-compose.yml` and `.env.example` to your apps directory
2. Rename `.env.example` to `.env` and fill in your HA credentials
3. Adjust the volume mount (`./data:/app/data`) to point to your dataset
4. Deploy via the TrueNAS UI or `docker compose up -d`

The SQLite database persists in the `/app/data` volume, safe on ZFS pools.

## Database Schema

**utilities** — Utility definitions (name, type, HA entity)

**tariff_rates** — Versioned rates with effective dates and reference URLs

**bills** — Monthly consolidated bills with payment status

**bill_items** — Per-utility line items with reading method, consumption, and cost

Migrations are generated via `drizzle-kit generate` and applied with `bun run db:migrate`.

## Home Assistant Integration

### Preparation

Before enabling HA integration, complete these steps in Home Assistant:

#### 1. Create a Long-Lived Access Token

1. Open your HA profile page (click your user icon → **Profile**).
2. Scroll to the **Long-Lived Access Tokens** section.
3. Click **Create Token**, give it a name (e.g. `Paynless`), and copy the generated token.
4. Set this as the `HA_TOKEN` environment variable.

> Do not use a short-lived session token — the server runs as a background process and needs a persistent token.

#### 2. Find Your Mobile App Notification Service

The notify service name depends on your device. To find it:

1. Go to **Developer Tools → Services** in HA.
2. Search for `notify`.
3. Look for your device's service — it will be something like `mobile_app` or `mobile_app_johns_phone`.
4. Use the suffix (the part after `notify.`) as the `HA_NOTIFY_SERVICE` value.

For example, if the full service is `notify.mobile_app`, set `HA_NOTIFY_SERVICE=mobile_app`.

#### 3. Map Utilities to HA Entities

When creating or editing a utility in Paynless, enter the HA entity ID (e.g. `sensor.water_meter`) in the **HA Entity** field. This tells Paynless which sensor to read when you select the "Home Assistant" input method for a bill.

You can find entity IDs in **Developer Tools → States** or under **Settings → Devices & Services → Entities**.

### Sensor Reading

When creating a bill with the **HA** input type, the server fetches the current state:

```
GET {HA_URL}/api/states/{ha_entity_id}
Authorization: Bearer {HA_TOKEN}
```

The sensor's `state` value is used as the current reading.

### Monthly Reminders

A background cron worker posts to the HA mobile app notification endpoint:

```
POST {HA_URL}/api/services/notify/{HA_NOTIFY_SERVICE}
Authorization: Bearer {HA_TOKEN}
Body: { "message": "Don't forget to submit your bills!", "title": "Paynless Reminder" }
```

The schedule defaults to the 1st of every month at 9 AM and is configurable via `CRON_SCHEDULE`.

## License

[MIT](LICENSE)
