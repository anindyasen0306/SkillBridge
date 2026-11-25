# Free-tier deployment
This is a proposed configuration, not a live deployment. Verify current free plans and model availability before creating resources. Do not enable paid upgrades.
1. Push this folder to a GitHub repository. Do not commit .env files or secrets.
2. Create a Neon free PostgreSQL project. Copy its PostgreSQL connection URL (with sslmode=require).
3. Create a Groq API key and verify the selected model supports JSON mode. Change GROQ_MODEL if needed. Resume text is sent to Groq; disclose this to users before upload and use synthetic resumes for testing.
4. Import the GitHub repo in Vercel, set root directory frontend, framework Vite, and use the free plan if eligible. Set VITE_API_BASE_URL to the eventual Render HTTPS URL (no trailing slash). Redeploy after setting it.
5. Import the repo as a Render Blueprint using render.yaml. Supply DATABASE_URL, GROQ_API_KEY and ALLOWED_ORIGINS (a JSON array such as ["https://your-actual-project.vercel.app"]). Keep plan free. The Docker startup command runs Alembic migrations before starting FastAPI.
6. Verify the backend root returns status ok. Verify registration, login, analysis using a synthetic PDF, history, deletion, and refresh on protected frontend routes. Free instances may sleep and AI quotas may be exhausted. Never publish a real resume until privacy and security requirements are met.
