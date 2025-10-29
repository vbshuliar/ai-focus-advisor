from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.db import crud
from app.schemas.advice import SavedAdviceCreate, SavedAdviceResponse, DeleteResponse

router = APIRouter()


@router.post("", response_model=SavedAdviceResponse, status_code=201)
def create_saved_advice(data: SavedAdviceCreate, db: Session = Depends(get_db)):
    """
    Save advice to database.

    Args:
        data: SavedAdviceCreate containing question and advice
        db: Database session

    Returns:
        SavedAdviceResponse with saved advice details

    Raises:
        HTTPException: If save operation fails
    """
    try:
        # Create an idea with the question as title and advice as description
        idea = crud.create_idea(db, title=data.question, description=data.advice)

        return SavedAdviceResponse(
            id=idea.id,
            question=idea.title,
            advice=idea.description,
            created_at=idea.created_at.isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving advice: {str(e)}")


@router.get("", response_model=list[SavedAdviceResponse])
def get_all_saved_advice(db: Session = Depends(get_db)):
    """
    Get all saved advice from database.

    Args:
        db: Database session

    Returns:
        List of SavedAdviceResponse objects

    Raises:
        HTTPException: If fetch operation fails
    """
    try:
        ideas = crud.get_all_ideas(db)
        return [
            SavedAdviceResponse(
                id=idea.id,
                question=idea.title,
                advice=idea.description or "",
                created_at=idea.created_at.isoformat()
            )
            for idea in ideas
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching saved advice: {str(e)}")


@router.get("/{advice_id}", response_model=SavedAdviceResponse)
def get_saved_advice_by_id(advice_id: int, db: Session = Depends(get_db)):
    """
    Get specific saved advice by ID.

    Args:
        advice_id: ID of the saved advice
        db: Database session

    Returns:
        SavedAdviceResponse object

    Raises:
        HTTPException: If advice not found or fetch operation fails
    """
    try:
        idea = crud.get_idea_by_id(db, advice_id)
        if not idea:
            raise HTTPException(status_code=404, detail="Saved advice not found")

        return SavedAdviceResponse(
            id=idea.id,
            question=idea.title,
            advice=idea.description or "",
            created_at=idea.created_at.isoformat()
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching saved advice: {str(e)}")


@router.delete("/{advice_id}", response_model=DeleteResponse)
def delete_saved_advice(advice_id: int, db: Session = Depends(get_db)):
    """
    Delete saved advice by ID.

    Args:
        advice_id: ID of the saved advice to delete
        db: Database session

    Returns:
        DeleteResponse with success message

    Raises:
        HTTPException: If advice not found or delete operation fails
    """
    try:
        idea = crud.get_idea_by_id(db, advice_id)
        if not idea:
            raise HTTPException(status_code=404, detail="Saved advice not found")

        db.delete(idea)
        db.commit()

        return DeleteResponse(
            message="Saved advice deleted successfully",
            id=advice_id
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting saved advice: {str(e)}")
