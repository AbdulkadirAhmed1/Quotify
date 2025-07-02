# /app/api/quotes.py

from fastapi import APIRouter, HTTPException
from app.db.mongo import quotes_collection
from app.models.quote_model import QuoteModel
from bson.objectid import ObjectId
import random

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
    try:
        quotes = await quotes_collection.find({"text": {"$exists": True}, "author": {"$exists": True}}).to_list(length=100)
        
        if not quotes:
            raise HTTPException(status_code=404, detail="No quotes found")
        
        quote = random.choice(quotes)
        return {"success": True, "data": quote_helper(quote)}

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.get("/quotes")
async def get_all_quotes():
    try:
        quotes = await quotes_collection.find({"text": {"$exists": True}, "author": {"$exists": True}}).to_list(length=100)
        
        if not quotes:
            raise HTTPException(status_code=404, detail="No quotes found")

        return {"success": True, "data": [quote_helper(q) for q in quotes]}
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.post("/quotes")
async def add_quote(quote: QuoteModel):
    try:
        new_quote = {"text": quote.text, "author": quote.author}
        result = await quotes_collection.insert_one(new_quote)
        
        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Failed to add quote")
        
        return {"success": True, "data": {"id": str(result.inserted_id), "message": "Quote added successfully"}}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.delete("/quotes/{quote_id}")
async def delete_quote(quote_id: str):
    try:
        quote = await quotes_collection.find_one({"_id": ObjectId(quote_id)})
        if not quote:
            raise HTTPException(status_code=404, detail="Quote not found")

        await quotes_collection.delete_one({"_id": ObjectId(quote_id)})
        
        return {"success": True, "message": "Quote deleted", "data": quote_helper(quote)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.delete("/quotes")
async def delete_all_quotes():
    try:
        result = await quotes_collection.delete_many({})
        return {"success": True, "message": f"Deleted {result.deleted_count} quotes"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
