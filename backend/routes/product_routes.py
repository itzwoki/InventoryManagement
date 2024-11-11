from models import Product
from schemas import ProductCreate, ProductOut
from db import SessionLocal
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from auth_utils import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/products/", response_model=ProductOut)
async def create_product(product: ProductCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    db_product = db.query(Product).filter(Product.name == product.name).first()
    if db_product:
        raise HTTPException(status_code=400, detail="Product alredy exists!")
    
    new_product= Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.get("/products/", response_model=list[ProductOut])
async def get_products(skip: int =0, limit: int=10, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    products = db.query(Product).offset(skip).limit(limit).all()
    return products

@router.get("/products/{product_id}", response_model=ProductOut)
async def get_product(product_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=400, detail="Product not Found!")
    return product

@router.put("/products/{product_id}", response_model=ProductOut)
async def update_product(product_id: int, updated_product: ProductCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=400, detail="Product not found!")
    
    for key, value in updated_product.dict().items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product

@router.delete("/product/{product_id}")
async def delete_product(product_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not Found!")
    
    db.delete(product)
    db.commit()
    return {"message": f"Product with ID:{product_id} has been deleted."}