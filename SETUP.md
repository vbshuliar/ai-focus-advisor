# Quick Setup Guide

## Start the Backend
```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
uvicorn main:app --reload --port 8000
```

## Start the Frontend
```bash
cd ai-focus-advisor\ai-focus-advisor
npm run dev
```

## Test It
1. Open http://localhost:3000
2. Type a question like "How can I stay focused while working?"
3. Click Send or press Enter
4. Watch the AI response appear!

## What Was Integrated
- Created API service (`src/lib/api.ts`) to communicate with FastAPI backend
- Updated UI (`src/app/page.tsx`) to call the backend API
- Added loading spinner while waiting for responses
- Added error handling with user-friendly messages
- Enabled Enter key to send messages
- Configured environment variables for both frontend and backend
- Set up .gitignore to protect API keys

## Security Note
Your OpenAI API key is now in `backend/.env`. Make sure to rotate it since it was exposed publicly!
