# Quick Setup Guide

## Overview
AI Focus Advisor - A full-stack application with FastAPI backend and Next.js frontend, following industry best practices and clean architecture.

## Prerequisites
- Python 3.14+
- Node.js 16+
- npm or yarn

## Project Structure
```
ai-focus-advisor/                  # Project root
├── backend/                       # FastAPI backend (Python)
│   ├── app/                      # Refactored application code
│   │   ├── api/routes/           # API route handlers
│   │   ├── core/                 # Config and settings
│   │   ├── db/                   # Database models and operations
│   │   └── schemas/              # Pydantic schemas
│   └── main.py                   # Entry point
└── ai-focus-advisor/             # Next.js frontend (TypeScript)
    └── src/
        ├── app/                  # Next.js app directory
        ├── components/           # Reusable React components
        ├── hooks/                # Custom React hooks
        └── lib/                  # Utilities and API client

Note: The frontend folder is named "ai-focus-advisor" (project name).
For a cleaner structure, you can rename it to "frontend" when servers are stopped.
```

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Create and activate virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install fastapi uvicorn openai python-dotenv sqlalchemy
```

### 4. Environment variables
The `.env` file is already configured with your OpenAI API key.
**Important**: Rotate the API key as it was previously exposed.

### 5. Start the backend
```bash
uvicorn main:app --reload --port 8000
```

Backend will be available at: **http://localhost:8000**

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd ai-focus-advisor  # This is the Next.js frontend folder
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables
The `.env.local` file is already configured to point to http://localhost:8000

### 4. Start the frontend
```bash
npm run dev
```

Frontend will be available at: **http://localhost:3000**

## Testing the Integration

1. **Open** http://localhost:3000 in your browser
2. **Type** a question like "How can I improve my focus?"
3. **Click** Send or press Enter
4. **View** the AI-generated advice
5. **Click** Confirm to save
6. **See** the saved advice in the sidebar
7. **Click** any saved item to view it again
8. **Click** the trash icon to delete

## Architecture Highlights

### Backend
- ✅ Modular FastAPI structure with routers
- ✅ Pydantic schemas for validation
- ✅ SQLAlchemy ORM with SQLite database
- ✅ Dependency injection for database sessions
- ✅ Centralized configuration management
- ✅ CORS enabled for frontend communication

### Frontend
- ✅ Component-based architecture
- ✅ Custom hooks for state management
- ✅ TypeScript for type safety
- ✅ Reusable, testable components
- ✅ Separation of concerns (UI/Logic/Data)

## Key Features

### Current Features
- AI-powered advice generation using OpenAI
- Persistent storage of saved advice
- Real-time response display
- Duplicate prevention for saved items
- Delete saved advice
- Responsive UI with dark mode support

### Duplicate Prevention
- When viewing a saved item, the Confirm button shows "Already Saved" and is disabled
- Prevents accidental duplicate saves

### Database
- SQLite for development
- Auto-creates tables on startup
- Easily switchable to PostgreSQL/MySQL

## Troubleshooting

### Backend Issues
**Port already in use:**
```bash
# Kill process on port 8000
# Windows: netstat -ano | findstr :8000
# Mac/Linux: lsof -ti:8000 | xargs kill
```

**Module not found:**
```bash
pip install -r requirements.txt  # If you create one
```

### Frontend Issues
**Port already in use:**
Next.js will automatically use port 3001 if 3000 is occupied

**Compilation errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Development Commands

### Backend
```bash
# Run with auto-reload
uvicorn main:app --reload --port 8000

# Run tests (when added)
pytest

# Check code quality
pylint app/
```

### Frontend
```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Documentation

- `ARCHITECTURE.md` - Detailed architecture documentation
- `INTEGRATION_GUIDE.md` - Original integration guide
- `README.md` - Project overview

## Security Reminders

1. **Rotate API Keys**: The OpenAI API key should be rotated
2. **Environment Variables**: Never commit `.env` files
3. **CORS**: Update `BACKEND_CORS_ORIGINS` in production to specific domains
4. **Database**: Use PostgreSQL in production, not SQLite

## Next Steps

See `ARCHITECTURE.md` for:
- Detailed architecture explanation
- Design patterns used
- Best practices applied
- Future enhancement ideas
- Contributing guidelines

---

**Developed by Terdessa**
