from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB Setup
MONGO_URI = "mongodb+srv://AbdulQadir:KbNhkieJnJ524OQT@quotifycluster.6d5gmjw.mongodb.net/?retryWrites=true&w=majority&appName=QuotifyCluster"
client = AsyncIOMotorClient(MONGO_URI)
db = client.quotify_db  # Database name
quotes_collection = db.quotes  # Collection name