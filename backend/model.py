from typing import List, Optional
from pydantic import BaseModel, EmailStr


class User(BaseModel):
    name: str
    age: int
    password: str
    email: EmailStr
    role: Optional[str] = "user"
    branch_id: Optional[str] = None


class Login(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    name: str
    age: int
    email: EmailStr
    role: str
    branch_id: Optional[str] = None


class LoginResponse(BaseModel):
    access_token: str
    role: str
    user: UserPublic


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str


class Product(BaseModel):
    name: str
    weight: str
    price: str
    img: str
    category: str
    tag: Optional[str] = None


class OrderItem(BaseModel):
    product_id: str
    name: str
    weight: str
    price: str
    quantity: int


class Order(BaseModel):
    items: List[OrderItem]
    total: str
    branch_id: Optional[str] = None


class Contact(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class Branch(BaseModel):
    name: str
    address: str
    phone: Optional[str] = None


class BranchUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None


class WorkerCreate(BaseModel):
    name: str
    age: int
    email: EmailStr
    password: str
