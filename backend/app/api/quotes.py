from fastapi import APIRouter, HTTPException
from app.db.mongo import quotes_collection
from app.models.quote_model import QuoteModel
from bson.objectid import ObjectId

router = APIRouter()

# Helper to convert Mongo _id to string
def quote_helper(quote) -> dict:
    return {
        "id": str(quote["_id"]),
        "text": quote["text"],
        "author": quote["author"]
    }

@router.get("/quotes/random")
async def get_random_quote():
    quote = await quotes_collection.aggregate([{"$sample": {"size": 1}}]).to_list(length=1)
    if quote:
        return quote_helper(quote[0])
    return {"message": "No quotes found"}

@router.post("/quotes")
async def add_quote(quote: QuoteModel):
    new_quote = {"text": quote.text, "author": quote.author}
    result = await quotes_collection.insert_one(new_quote)
    
    if result.inserted_id:
        return {"id": str(result.inserted_id), "message": "Quote added successfully"}
    
    raise HTTPException(status_code=500, detail="Failed to add quote")
