#/backend/app/db/mongo.py
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.mongo_uri)
db = client.quotify_db
quotes_collection = db.quotes