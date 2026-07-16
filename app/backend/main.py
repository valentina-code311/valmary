from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import DEPLOYMENT_VERSION
from endpoints.users import router as users_router
from endpoints.hero_slides import router as hero_slides_router
from endpoints.story_milestones import router as story_milestones_router
from endpoints.ceremony_steps import router as ceremony_steps_router
from endpoints.pages import router as pages_router
from endpoints.photo_categories import router as photo_categories_router
from endpoints.photo_uploads import router as photo_uploads_router
from endpoints.wishes import router as wishes_router
from endpoints.playlist_tracks import router as playlist_tracks_router
from endpoints.challenges import router as challenges_router
from endpoints.challenge_submissions import router as challenge_submissions_router

app = FastAPI()
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(hero_slides_router, prefix="/hero_slides", tags=["hero_slides"])
app.include_router(story_milestones_router, prefix="/story_milestones", tags=["story_milestones"])
app.include_router(ceremony_steps_router, prefix="/ceremony_steps", tags=["ceremony_steps"])
app.include_router(pages_router, prefix="/pages", tags=["pages"])
app.include_router(photo_categories_router, prefix="/photo_categories", tags=["photo_categories"])
app.include_router(photo_uploads_router, prefix="/photo_uploads", tags=["photo_uploads"])
app.include_router(wishes_router, prefix="/wishes", tags=["wishes"])
app.include_router(playlist_tracks_router, prefix="/playlist_tracks", tags=["playlist_tracks"])
app.include_router(challenges_router, prefix="/challenges", tags=["challenges"])
app.include_router(challenge_submissions_router, prefix="/challenge_submissions", tags=["challenge_submissions"])

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/")
def root():
  return {
    "message": "Welcome to Valmary API",
    "version": DEPLOYMENT_VERSION,
  }
