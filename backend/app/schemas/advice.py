from pydantic import BaseModel


class AdviceRequest(BaseModel):
    """Request model for advice generation"""
    question: str
    category: str = "general"


class AdviceResponse(BaseModel):
    """Response model for advice generation"""
    advice: str
    question: str


class SavedAdviceCreate(BaseModel):
    """Request model for saving advice"""
    question: str
    advice: str


class SavedAdviceResponse(BaseModel):
    """Response model for saved advice"""
    id: int
    question: str
    advice: str
    created_at: str

    class Config:
        from_attributes = True


class DeleteResponse(BaseModel):
    """Response model for delete operations"""
    message: str
    id: int
