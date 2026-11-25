# SkillBridge deployment and verification

This revised MVP preserves React, FastAPI, PostgreSQL and Ollama. No public deployment has been performed.

## Local Docker deployment
1. Install Docker with Compose. Copy `.env.example` to `.env` at the repository root.
2. Generate two independent random hex strings (for example `openssl rand -hex 32` twice) and fill POSTGRES_PASSWORD and SECRET_KEY. Do not commit .env.
3. Run `docker compose up -d --build`.
4. Run `docker compose exec ollama ollama pull llama3` and wait for the model download.
5. Open http://localhost:8080. Allow sufficient RAM and disk for Llama3.
6. Register, log in, upload a text-based PDF and enter a job description, inspect results, history and deletion. Verify a second account cannot access the first account's records.

## Public deployment
Use a VM with Docker Compose and adequate memory for Ollama, or deploy the backend and frontend separately with managed PostgreSQL and a private Ollama host. Configure HTTPS and reverse proxy to localhost:8080 on the VM; do not expose PostgreSQL or Ollama publicly. For separate hosting, set VITE_API_BASE_URL to the HTTPS API URL and ALLOWED_ORIGINS to a JSON array containing the exact HTTPS frontend origin. Set DATABASE_URL, SECRET_KEY, OLLAMA_BASE_URL and OLLAMA_MODEL on the backend. Run `alembic upgrade head` before starting uvicorn. Existing databases created by create_all must be backed up and checked against the initial migration before stamping `alembic stamp 0001_initial`; do not blindly stamp a database.

## Verification and limitations
Eight schema/JSON/password unit tests passed in the available environment; Python syntax compilation passed. Frontend dependencies were not cached, so build/lint were not verified. Docker, live PostgreSQL, full authentication and Ollama inference were not tested. No public URL exists yet. CI configuration is provided but has not run. Dependency lockfile is still missing. Before public use, add rate limiting, review dependency vulnerabilities, improve token storage and define retention/deletion policies. New analyses no longer store extracted resume text or raw AI output; existing records are unchanged. Job descriptions and analysis results remain stored. Billing and password recovery are outside this MVP.
