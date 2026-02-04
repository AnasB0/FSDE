# QA Checklist & Launch Runbook

## QA Checklist
- Auth
  - Register new user
  - Login with valid credentials
  - Block protected routes without JWT
- Shipments
  - Create shipment with required fields
  - List shipments for current user
  - Update status
- AI
  - Route recommendation works with API key
  - Mock response when API key missing
- UI/UX
  - Responsive layout on mobile
  - Error states visible

## Launch Runbook
1. Ensure Docker is running.
2. Copy env template:
   - cp .env.example .env
3. Set OPENROUTER_API_KEY and JWT_SECRET.
4. Start stack:
   - docker compose up --build
5. Verify:
   - Client: http://localhost:5173
   - API: http://localhost:4000/health
   - AI: http://localhost:8000/health

## Troubleshooting
- Port conflicts: change ports in docker-compose.yml
- Mongo connection errors: ensure mongo container is healthy
- AI errors: verify OPENROUTER_API_KEY and network access
