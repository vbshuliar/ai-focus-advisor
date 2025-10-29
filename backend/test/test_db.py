from app.db.session import SessionLocal, init_db
from app.db import crud

init_db()
db = SessionLocal()

# Create new idea
idea = crud.create_idea(db, title="Build a weather app", description="I want an app to show forecasts")
print("Created Idea:", idea)

# Add recommendation
crud.add_recommendation(db, idea.id, "Start with OpenWeather API integration.")

# Fetch everything
ideas = crud.get_all_ideas(db)
print("All ideas:", ideas)

recs = crud.get_recommendations_for_idea(db, idea.id)
print("Recommendations for first idea:", recs)