```bash
venv\Scripts\activate
uvicorn app.main:app --reload --env-file .env
deactivate