import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import stripe
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import hashlib
from pydantic import BaseModel
from dotenv import load_dotenv


load_dotenv()


stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")

# Local imports
from    db import engine, Base
from models import UserInDB
from routes.product_routes import router as product_router
from schemas import User, LoginUser
from utils import create_access_token
from auth_utils import get_current_user
from dependencies import get_db


app = FastAPI()


Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PaymentIntentRequest(BaseModel):
    amount: int

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app.include_router(product_router, prefix="/inventory", tags=["Products"])

@app.post("/signup")
async def signup(user: User, db: Session = Depends(get_db)):
    db_user = db.query(UserInDB).filter(UserInDB.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    new_user = UserInDB(username=user.username, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User successfully created"}

@app.post("/login")
async def login(user: LoginUser, db: Session = Depends(get_db)):
    db_user = db.query(UserInDB).filter(UserInDB.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Username doesn't exist")
    
    hashed_input_pass = hashlib.sha256(user.password.encode()).hexdigest()
    if hashed_input_pass != db_user.password:
        raise HTTPException(status_code=400, detail="Invalid password")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "message": "Login successful"}

@app.delete('/users/{user_id}')
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserInDB).filter(UserInDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": f"User with ID {user_id} has been deleted"}

@app.get('/users/me')
async def get_current_user_info(current_user: UserInDB = Depends(get_current_user)):
    return {"username": current_user.username, "email": current_user.email}

@app.get('/users')
async def get_all_users(db: Session = Depends(get_db)):
    users = db.query(UserInDB).all()
    return {"users": users if users else []}



@app.get("/config")
async def get_publishable_key():
    """Endpoint to send the Stripe publishable key to the frontend."""
    if not STRIPE_PUBLISHABLE_KEY:
        raise HTTPException(status_code=500, detail="Stripe publishable key not found.")
    return {"publishableKey": STRIPE_PUBLISHABLE_KEY}

@app.post("/create-payment-intent")
async def create_payment_intent(request: PaymentIntentRequest):
    try:
        intent = stripe.PaymentIntent.create(
            amount=request.amount,
            currency="usd",
            payment_method_types=["card"]
        )
        return {"clientSecret": intent["client_secret"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

