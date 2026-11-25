# SkillBridge — quick local start (Windows)

Requires Python 3.11, Node.js 22, internet and a Groq API key. No Ollama or PostgreSQL installation is needed for this local preview. SQLite stores local accounts and history; use PostgreSQL for cloud deployment.

1. Extract the ZIP. Open the skillbridge folder in VS Code.
2. Open https://console.groq.com/keys and create an API key. Never share it or commit it.
3. In the VS Code PowerShell terminal, run:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
.\.venv\Scripts\python.exe -c "import secrets; print(secrets.token_urlsafe(48))"
```

Open backend/.env. Set GROQ_API_KEY to your key and SECRET_KEY to the generated value. Keep AI_PROVIDER=groq and DATABASE_URL=sqlite:///./skillbridge.db. Verify GROQ_MODEL is available in your Groq console; change it if necessary.

```powershell
.\.venv\Scripts\python.exe -m alembic upgrade head
.\.venv\Scripts\python.exe -m uvicorn main:app --port 8000
```

4. Open a second terminal from the skillbridge root:

```powershell
cd frontend
npm install
npm run dev
```

5. Open http://localhost:5173, register, upload a text-based PDF resume with fictional details, paste a job description of at least 50 characters and click Analyze Resume. Check history and logout/login.

If Groq returns quota or model errors, check your console. No paid plan is required for local hosting; API free-tier availability and limits depend on Groq. Do not upload real personal data without consent. For public deployment see FREE_DEPLOYMENT.md.
