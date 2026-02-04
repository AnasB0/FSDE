# Sequential Build Prompts

Use the prompts below in order. Each prompt is self-contained and references the KSA logistics SaaS problem.

## 1) Product Definition & Scope
Prompt:
Create a concise product scope for a KSA transportation/logistics SaaS. Include primary personas, pain points, core workflows, non-functional requirements (security, latency, uptime), and success metrics. Constrain to an MVP that can be deployed locally using Docker Compose. Include a risk register and assumptions.

## 2) Domain Model & API Contract
Prompt:
Design the domain model for a shipment tracking system (User, Shipment, RouteRecommendation). Provide field definitions, validation rules, example JSON, and REST endpoints for auth, shipments, and AI. Include pagination, error responses, and JWT auth flow.

## 3) Backend (Node.js + Express + MongoDB)
Prompt:
Implement the backend API in Node.js + Express with MongoDB (Mongoose). Use JWT auth (register/login). Provide endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/shipments (auth)
- POST /api/shipments (auth)
- PATCH /api/shipments/:id/status (auth)
- POST /api/ai/route-recommendation (auth) -> proxies to AI service
Add request validation, error handling, and a health endpoint. Provide Dockerfile and package.json.

## 4) AI Service (Flask + OpenRouter)
Prompt:
Implement a Flask AI microservice with POST /predict. It should accept origin, destination, vehicleType, constraints and call OpenRouter chat completions (model openai/gpt-4o-mini). If API key missing, return a mocked response. Provide Dockerfile, requirements.txt, and health endpoint.

## 5) Frontend (React + Vite)
Prompt:
Build a responsive React UI for the SaaS. Pages:
- Auth screen with register/login toggle
- Dashboard with shipment creation form, shipment table, and AI route recommendation form
- Use Axios to call backend, store JWT in localStorage, and set authorization headers
Provide a modern UI/UX styling using CSS. Include error states.

## 6) Infrastructure as Code (Docker Compose)
Prompt:
Create docker-compose.yml that runs MongoDB, API service, AI service, and the React client. Include environment variables and local ports. Add .env.example. Ensure services depend on Mongo and AI.

## 7) QA Checklist & Launch Runbook
Prompt:
Provide a QA checklist (auth, CRUD, AI response, UI responsiveness) and a runbook to launch locally. Include troubleshooting steps for common Docker issues.
