from sqlalchemy.orm import Session
from . import models


def create_idea(db: Session, title: str, description: str | None = None):
    idea = models.Idea(title=title, description=description)
    db.add(idea)
    db.commit()
    db.refresh(idea)
    return idea


def add_recommendation(db: Session, idea_id: int, recommendation_text: str):
    rec = models.Recommendation(idea_id=idea_id, recommendation_text=recommendation_text)
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec


def get_all_ideas(db: Session):
    return db.query(models.Idea).all()


def get_idea_by_id(db: Session, idea_id: int):
    return db.query(models.Idea).filter(models.Idea.id == idea_id).first()


def get_recommendations_for_idea(db: Session, idea_id: int):
    return (
        db.query(models.Recommendation)
        .filter(models.Recommendation.idea_id == idea_id)
        .order_by(models.Recommendation.created_at.desc())
        .all()
    )
