# PurePath ERP

**Status:** Deployed | **Live:** [purepath-erp.com](https://purepath-erp.com)

> A companion ERP application representing one company operating on [Routebase TMS](https://routebase.cloud). Demonstrates how an individual business using the TMS would integrate their own ERP system. It handles order entry, product management, and customer management with bidirectional data sync.

---

## What It Does

PurePath ERP represents a single company operating on Routebase TMS. It isn't a blanket service, but is instead a demonstration of how one business would build and integrate their own ERP with the TMS. It manages product catalogs, customers, customer locations, and order entry by posting new orders directly to the Routebase TMS ingestion endpoint and receiving shipment status updates back via a cron-based sync job.

For full architecture and integration details, see the [Routebase TMS README](https://github.com/samuelwbrown4/routebase).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Mantine |
| Backend | Node.js, Express |
| Database | PostgreSQL (Supabase) |
| Auth | API Keys (system-to-system) |
| Hosting | AWS EC2, Amplify, ALB, Route 53 |
| Other | Supabase JS |

---

## Features

- Order entry with line item management (outbound & inbound)
- Product catalog management
- Customer and customer location creation
- TMS-first creation flow: customers and locations are created in Routebase first, with TMS-issued IDs stored on ERP records to maintain referential integrity across both systems
- Automatic order ingestion to Routebase TMS on order submission
- Shipment status sync from Routebase TMS back to ERP orders via cron job

---

## Running Locally

### Prerequisites
- Node.js
- NPM
- Supabase project
- Routebase TMS running locally or deployed — PurePath ERP communicates with the TMS API and will error without it

### PurePath ERP Frontend
```bash
git clone <repo>
cd purepath-erp-frontend
npm install
cp .env.example .env  # set VITE_API_URL
npm run dev
```

### PurePath ERP Backend
```bash
git clone <repo>
cd purepath-erp-backend
npm install
cp .env.example .env  # set DB credentials, TMS_API_URL, TMS_API_KEY, Supabase credentials
node index.js
```
