# AI Focus Advisor - Architecture Documentation

## Project Overview
AI Focus Advisor is a full-stack web application that provides AI-generated advice using OpenAI's GPT-4o-mini model, with persistent storage of responses in a SQLite database.

## Technology Stack

### Backend
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Database**: SQLite (development) - easily switchable to PostgreSQL/MySQL
- **AI**: OpenAI GPT-4o-mini
- **Language**: Python 3.14

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

---

## Backend Architecture

The backend follows **FastAPI best practices** with a modular, scalable structure:

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # Application factory
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py                # Dependency injection
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── advice.py          # AI advice generation routes
│   │       └── saved_advice.py    # CRUD operations for saved advice
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py              # Application settings
│   ├── db/
│   │   ├── __init__.py
│   │   ├── base.py                # SQLAlchemy declarative base
│   │   ├── models.py              # Database models
│   │   ├── session.py             # Database session management
│   │   └── crud.py                # Database operations
│   └── schemas/
│       ├── __init__.py
│       └── advice.py              # Pydantic models for validation
├── main.py                        # Backwards compatibility wrapper
├── .env                          # Environment variables
└── ideas.db                      # SQLite database
```

### Design Patterns

1. **Application Factory Pattern** (`app/main.py`)
   - Separates app creation from configuration
   - Easy testing and multiple app instances

2. **Dependency Injection** (`app/api/deps.py`)
   - Database session management
   - Ensures proper resource cleanup

3. **Repository Pattern** (`app/db/crud.py`)
   - Abstracts database operations
   - Easy to switch databases

4. **Router Pattern** (`app/api/routes/`)
   - Modular route organization
   - Separate concerns (advice vs saved_advice)

### API Endpoints

**Advice Generation:**
- `POST /api/advice` - Generate AI advice

**Saved Advice Management:**
- `POST /api/saved-advice` - Save advice
- `GET /api/saved-advice` - Get all saved advice
- `GET /api/saved-advice/{id}` - Get specific advice
- `DELETE /api/saved-advice/{id}` - Delete advice

**Health:**
- `GET /health` - Health check
- `GET /` - API information

### Configuration Management

`app/core/config.py` centralizes all configuration:
- API settings
- OpenAI configuration
- CORS settings
- Database URL

---

## Frontend Architecture

The frontend follows **React best practices** with component-based architecture:

```
ai-focus-advisor/
└── src/
    ├── app/
    │   ├── layout.tsx             # Root layout
    │   ├── page.tsx               # Main page (orchestration)
    │   └── globals.css            # Global styles
    ├── components/
    │   ├── AdviceDisplay.tsx      # Advice response display
    │   ├── MessageInput.tsx       # Message input and send button
    │   └── SavedResponsesList.tsx # Sidebar with saved items
    ├── hooks/
    │   └── useSavedAdvice.ts      # Custom hook for saved advice state
    └── lib/
        ├── api.ts                 # API client functions
        └── types.ts               # Shared TypeScript interfaces
```

### Design Patterns

1. **Component Composition**
   - Small, focused components
   - Single Responsibility Principle
   - Reusable and testable

2. **Custom Hooks Pattern** (`hooks/useSavedAdvice.ts`)
   - Encapsulates complex state logic
   - Reusable across components
   - Separates business logic from UI

3. **Separation of Concerns**
   - `page.tsx` - Orchestration only
   - `components/` - Presentation logic
   - `hooks/` - State management
   - `lib/` - External interactions

### Component Hierarchy

```
Page
├── AdviceDisplay
│   └── [Confirm Button]
├── SavedResponsesList
│   └── [SavedItem] × N
│       └── [Delete Button]
└── MessageInput
    └── [Send Button]
```

### State Management

**Local State** (useState):
- Current conversation (input, response, question)
- Loading states
- Error handling

**Custom Hook State** (useSavedAdvice):
- Saved responses list
- Currently selected saved item
- CRUD operations
- Error handling for persistence

---

## Data Flow

### Getting Advice

```
User Input → MessageInput
  ↓
page.tsx (handleSend)
  ↓
lib/api.ts (getAdvice)
  ↓
Backend: POST /api/advice
  ↓
OpenAI API
  ↓
Response → AdviceDisplay
```

### Saving Advice

```
User Click Confirm → AdviceDisplay
  ↓
page.tsx (handleConfirm)
  ↓
useSavedAdvice (saveNewAdvice)
  ↓
lib/api.ts (saveAdvice)
  ↓
Backend: POST /api/saved-advice
  ↓
Database (SQLite)
  ↓
Update State → SavedResponsesList
```

### Viewing Saved Advice

```
User Click Item → SavedResponsesList
  ↓
page.tsx (handleSavedItemClick)
  ↓
useSavedAdvice (selectSavedAdvice)
  ↓
Update Display → AdviceDisplay
```

---

## Database Schema

### Ideas Table
```sql
CREATE TABLE ideas (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,         -- Stores the question
    description TEXT,                    -- Stores the advice
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Recommendations Table (Future Use)
```sql
CREATE TABLE recommendations (
    id INTEGER PRIMARY KEY,
    idea_id INTEGER NOT NULL,
    recommendation_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
);
```

---

## Key Principles Applied

### Backend
1. **Separation of Concerns**: Routes, schemas, database, and config are separate
2. **Dependency Injection**: Database sessions managed via FastAPI dependencies
3. **Type Safety**: Pydantic models for validation
4. **Testability**: Modular structure easy to unit test
5. **Scalability**: Easy to add new routes and features

### Frontend
1. **Component Reusability**: Small, focused components
2. **Single Responsibility**: Each component has one job
3. **Custom Hooks**: Logic separation from UI
4. **Type Safety**: TypeScript interfaces for all data
5. **Performance**: Only re-renders what changes

### Overall
1. **DRY** (Don't Repeat Yourself): Shared types and utilities
2. **SOLID Principles**: Especially Single Responsibility and Dependency Inversion
3. **Clean Code**: Clear naming, comments, and structure
4. **Maintainability**: Easy to understand and modify
5. **Scalability**: Architecture supports growth

---

## Running the Application

### Backend
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd ai-focus-advisor
npm run dev
```

---

## Future Enhancements

### Backend
- [ ] Add authentication/authorization
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Switch to PostgreSQL for production
- [ ] Add Redis for caching
- [ ] Implement comprehensive testing

### Frontend
- [ ] Add loading skeletons
- [ ] Implement error boundaries
- [ ] Add unit tests (Jest/React Testing Library)
- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Implement offline support
- [ ] Add PWA features

---

## Contributing

When adding new features:

### Backend
1. Create schema in `app/schemas/`
2. Create/update models in `app/db/models.py`
3. Add CRUD operations in `app/db/crud.py`
4. Create router in `app/api/routes/`
5. Register router in `app/main.py`

### Frontend
1. Define types in `src/lib/types.ts`
2. Create API functions in `src/lib/api.ts`
3. Create custom hook if needed in `src/hooks/`
4. Create components in `src/components/`
5. Use components in pages

---

## License
This project is developed by Terdessa.
