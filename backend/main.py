from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Configure CORS - allows your React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Request model - what data we expect from frontend
class AdviceRequest(BaseModel):
    question: str
    category: str = "general"  # optional: career, relationship, life, etc.

# Response model - what we send back
class AdviceResponse(BaseModel):
    advice: str
    question: str

# Test endpoint - check if API is running
@app.get("/")
def read_root():
    return {"status": "API is running!", "message": "Use POST /api/advice to get advice"}

# Main advice endpoint
@app.post("/api/advice", response_model=AdviceResponse)
async def get_advice(request: AdviceRequest):
    try:
        # Create a prompt for GPT
        system_prompt = f"""You are a friendly and supportive advisor who gives brief, practical advice.

IMPORTANT RULES:
1. Keep your response under 300 characters total
2. Always format advice as a numbered list (1. 2. 3. 4. 5.)
3. Give 4-5 short recommendations
4. Be warm, friendly, and encouraging in tone
5. Each point should be ONE short sentence (max 10-12 words)

Topic: {request.category}"""
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Cheaper and faster for hackathon
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.question}
            ],
            temperature=0.7,
            max_tokens=300
        )
        
        # Extract the advice from response
        advice_text = response.choices[0].message.content
        
        return AdviceResponse(
            advice=advice_text,
            question=request.question
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Run with: uvicorn main:app --reload --port 8000