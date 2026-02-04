# KSA Logistics SaaS Prototype

A full-stack SaaS prototype for Saudi Arabia transportation and logistics operations. Includes shipment tracking, AI route intelligence, JWT authentication, and Docker Compose infrastructure for local deployment.

## Modules
- API Service: Node.js + Express + MongoDB
- AI Service: Flask + OpenRouter integration
- Web Client: React + Vite
- Infrastructure: Docker Compose

## Full Functionality (In-Depth)
### 1) Authentication & Access Control
- Register a new user (name, email, password, company)
- Login to receive JWT
- JWT automatically applied to API requests
- Protected routes: shipments and AI routes

### 2) Shipment Operations
- Create shipment (tracking ID, origin, destination, status)
- View all shipments for the current user
- Status states: pending, in-transit, delivered, delayed
- Duplicate tracking IDs are rejected with a clear message

### 3) AI Route Intelligence
- Submit origin/destination/vehicle/constraints
- AI returns route guidance and risk alerts
- If AI provider fails or is missing, fallback guidance is returned (system remains usable)

### 4) Demo Data & Practical Scenario
- Demo user + realistic KSA shipment corridors
- Immediate visibility into sample operational data

### 5) Operational UI/UX
- Responsive dashboard for dispatchers
- Clear error states and AI output panel
- Works with local-only URLs (no external domains required)

## Local Run (Docker Compose)
1. Copy environment template:
   - `cp .env.example .env`
2. Update `OPENROUTER_API_KEY` and `JWT_SECRET` in .env
3. Start services:
   - `docker compose up --build`
4. Access (local only, no external domains):
   - Client: http://localhost:5173
   - API: http://localhost:4000/health
   - AI: http://localhost:8000/health

## Execution Steps (End-to-End)
1. Ensure Docker Desktop/Engine is running.
2. Create the environment file:
   - `cp .env.example .env`
3. Edit .env and set:
   - `JWT_SECRET`
   - `OPENROUTER_API_KEY` (optional; AI returns mock if not set)
4. Build and run the stack:
   - `docker compose up --build`
5. Validate services:
   - API: `curl http://localhost:4000/health`
   - AI: `curl http://localhost:8000/health`
   - Client: open http://localhost:5173
6. View logs (output):
   - All services: `docker compose logs -f`
   - API only: `docker compose logs -f server`
   - AI only: `docker compose logs -f ai-service`
   - Client only: `docker compose logs -f client`
7. Stop the stack when done:
   - `docker compose down -v`
8. Create an account, login, create a shipment, and run an AI recommendation.

## Detailed Usage Walkthrough (Full Execution)
1) Open the client in a browser:
   - http://localhost:5173
2) Login with demo credentials (or register your own):
   - Email: demo@ksa-logistics.sa
   - Password: Demo1234
3) Verify demo shipments render in the Active Shipments list.
4) Create a shipment:
   - Tracking ID: KSA-RYD-JED-777
   - Origin: Riyadh
   - Destination: Jeddah
   - Status: Pending
5) Submit AI Route Intelligence:
   - Origin: Riyadh
   - Destination: Jeddah
   - Vehicle Type: Truck
   - Constraints: Heat, rest, permits
6) Confirm:
   - Shipment appears in the list
   - AI panel shows guidance (real or fallback)

## Quick Start Prompt (copy/paste)
Use this exact sequence in a terminal to run the project and see output:

1) `cp .env.example .env`
2) Edit `.env` and set `JWT_SECRET` (required) and `OPENROUTER_API_KEY` (optional)
3) `docker compose up --build`
4) Output logs: `docker compose logs -f`
5. Verify (local only):
   - API: `curl http://localhost:4000/health`
   - AI: `curl http://localhost:8000/health`
   - Client: open http://localhost:5173

## Key API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/shipments (auth)
- POST /api/shipments (auth)
- POST /api/ai/route-recommendation (auth)

## What to Explore (Core Functionality)
- Authentication: register, login, JWT-protected routes
- Shipment tracking: create shipments and view active list
- Status visibility: pending, in-transit, delivered, delayed
- AI route intelligence: risk alerts and corridor guidance
- Operational UI: responsive dashboard for dispatchers

## Demo Data (Practical Sample)
Enable demo data by setting `SEED_DATA=true` in .env. On startup, the API seeds a demo user and sample shipments for KSA corridors.

Demo credentials:
- Email: demo@ksa-logistics.sa
- Password: Demo1234

If shipments do not appear, ensure `SEED_DATA=true` in .env and restart the server container.

Sample shipments include:
- Riyadh → Jeddah (in-transit)
- Riyadh → Dammam (pending)
- Jeddah → Madinah (delivered)
- Dammam → Al Khobar (in-transit)
- Abha → Riyadh (delayed)

## Notes
- If `OPENROUTER_API_KEY` is not set, the AI service returns a mock response.
- MongoDB data is stored in a named Docker volume.
 - Client uses same-origin `/api` to avoid CORS and external domains.

## Prompts & Runbook
- Prompts: [prompts/PROMPTS.md](prompts/PROMPTS.md)
- QA + Runbook: [docs/QA_RUNBOOK.md](docs/QA_RUNBOOK.md)
