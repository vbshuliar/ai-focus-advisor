from fastapi import APIRouter, HTTPException
from openai import OpenAI
from app.core.config import settings
from app.schemas.advice import AdviceRequest, AdviceResponse

router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=settings.OPENAI_API_KEY)


@router.post("/advice", response_model=AdviceResponse)
async def get_advice(request: AdviceRequest):
    """
    Generate AI advice based on user question.

    Args:
        request: AdviceRequest containing question and optional category

    Returns:
        AdviceResponse with generated advice

    Raises:
        HTTPException: If OpenAI API call fails
    """
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
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.question}
            ],
            temperature=settings.OPENAI_TEMPERATURE,
            max_tokens=settings.OPENAI_MAX_TOKENS
        )

        # Extract the advice from response
        advice_text = response.choices[0].message.content

        return AdviceResponse(
            advice=advice_text,
            question=request.question
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
