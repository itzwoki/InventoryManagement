from pydantic import BaseModel, EmailStr

class User(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginUser(BaseModel):
    username: str
    password: str

class ProductCreate(BaseModel):
    name: str
    description: str
    price: int
    quantity: int

class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    price: int
    quantity: int

    class Config:
        orm_mode = True
