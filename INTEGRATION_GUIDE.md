# AI Focus Advisor - Integration Guide

## Overview
The backend FastAPI server and Next.js frontend are now fully integrated. When users send a message through the UI, it gets processed by the FastAPI backend using OpenAI's API, and the response is displayed in the window.

## Project Structure
```
ai-focus-advisor/
├── backend/                    # FastAPI backend
│   ├── main.py                # API endpoints
│   └── .env                   # Backend environment variables (OpenAI API key)
└── ai-focus-advisor/          # Next.js frontend
    ├── src/
    │   ├── app/
    │   │   └── page.tsx       # Main UI component with API integration
    │   └── lib/
    │       └── api.ts         # API client service
    └── .env.local             # Frontend environment variables (API URL)
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (if not already done):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install fastapi uvicorn openai python-dotenv
   ```

5. The `.env` file is already configured with your OpenAI API key

6. Start the backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

   The backend will be available at: http://localhost:8000

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ai-focus-advisor/ai-focus-advisor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. The `.env.local` file is already configured to point to http://localhost:8000

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at: http://localhost:3000

## How It Works

### API Endpoint
- **URL**: `POST http://localhost:8000/api/advice`
- **Request Body**:
  ```json
  {
    "question": "Your question here",
    "category": "general"  // optional
  }
  ```
- **Response**:
  ```json
  {
    "advice": "AI-generated advice",
    "question": "Your original question"
  }
  ```

### Frontend Features
- **Input**: Type your message in the text field
- **Send**: Click the "Send" button or press Enter
- **Loading State**: Shows a spinner while waiting for the API response
- **Error Handling**: Displays error messages if the API is unreachable or returns an error
- **Response Display**: Shows the AI-generated advice in the response panel
- **Save Functionality**: Confirm button to save responses (currently saves to local state only)

### Key Files

#### `backend/main.py`
- FastAPI application with CORS enabled
- `/api/advice` endpoint that processes questions using OpenAI's GPT-4o-mini
- Error handling for API failures

#### `ai-focus-advisor/src/lib/api.ts`
- TypeScript API client
- `getAdvice()` function to call the backend
- Custom error handling with `ApiError` class
- Configurable API URL via environment variable

#### `ai-focus-advisor/src/app/page.tsx`
- Main UI component
- Integrated with the API service
- Loading and error states
- Enter key support for sending messages

## Testing the Integration

1. Start both servers (backend on port 8000, frontend on port 3000)
2. Open http://localhost:3000 in your browser
3. Type a question in the input field (e.g., "How can I improve my focus?")
4. Click "Send" or press Enter
5. You should see:
   - A loading spinner appear
   - The AI response appear in the "AI Response" panel
   - The ability to save the response by clicking "Confirm"

## Common Issues

### "Unable to connect to the server"
- Make sure the backend is running on port 8000
- Check that CORS is enabled in the backend (already configured)
- Verify the `NEXT_PUBLIC_API_URL` in `.env.local` is correct

### "Error: ..."
- Check the browser console for detailed error messages
- Verify the OpenAI API key in `backend/.env` is valid
- Check the backend logs for any Python errors

## Next Steps

As mentioned, the database integration is being worked on separately. Once ready, you can:
1. Add persistence for saved responses
2. Implement user authentication
3. Add conversation history
4. Store usage analytics

## Security Note

**IMPORTANT**: The OpenAI API key you provided has been exposed publicly. You should:
1. Go to https://platform.openai.com/api-keys
2. Revoke the current API key
3. Generate a new API key
4. Update it in `backend/.env`
5. Never share API keys in public channels again

The `.env` file is already in `.gitignore` to prevent accidental commits.