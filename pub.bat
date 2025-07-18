@echo off

REM --- Start Frontend (React/Vite/Next) ---
cd frontend
start cmd /k "npm run dev -- --host"
cd ..

REM --- Start PocketBase on 0.0.0.0:8090 ---
start cmd /k "pocketbase serve --http=0.0.0.0:8090"

REM --- Start Flask API using Gunicorn on 0.0.0.0:8000 ---
start cmd /k "uv run python -m waitress --host=0.0.0.0 --port=8000 main:app"

