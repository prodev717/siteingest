@echo off
cd frontend
start cmd /k npm run dev
cd ..
start cmd /k pocketbase serve
start cmd /k uv run main.py
end