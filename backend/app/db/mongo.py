#/backend/app/db/mongo.py
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import certifi

client = AsyncIOMotorClient(
    settings.mongo_uri,
    tls=True,
    tlsCAFile=certifi.where()
)
db = client.quotify_db
quotes_collection = db.quotes