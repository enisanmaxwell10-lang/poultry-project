from typing import List, Optional
from fastapi import FastAPI, status, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from model import User, Login, LoginResponse, UserPublic, ProfileUpdate, PasswordUpdate, Product, Order, Contact, Branch, BranchUpdate, WorkerCreate
from db import user_collection, product_collection, order_collection, contact_collection, branch_collection
from utils import hash_password, verify_password, create_access_token, decode_token

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ADMIN_EMAIL = "admin@greenfields.com"


# ─── Helpers ────────────────────────────────────────────────────────────

def serialize_product(doc):
    return {
        "id": doc.get("_id"),
        "name": doc.get("name"),
        "weight": doc.get("weight"),
        "price": doc.get("price"),
        "img": doc.get("img"),
        "category": doc.get("category"),
        "tag": doc.get("tag"),
        "branch_id": doc.get("branch_id"),
    }


def public_user(doc):
    return {
        "name": doc.get("name"),
        "age": doc.get("age"),
        "email": doc.get("email"),
        "role": doc.get("role", "user"),
        "branch_id": doc.get("branch_id"),
    }


def serialize_branch(doc):
    return {
        "id": doc.get("_id"),
        "name": doc.get("name"),
        "address": doc.get("address"),
        "phone": doc.get("phone", ""),
    }


def parse_price(price):
    digits = "".join(c for c in str(price) if c.isdigit() or c == ".")
    try:
        return float(digits)
    except ValueError:
        return 0.0


def format_naira(number):
    return f"₦{number:,.0f}"


def branch_stats(branch_id):
    admins = len(list(user_collection.find({"branch_id": branch_id, "role": "branch_admin"})))
    workers = len(list(user_collection.find({"branch_id": branch_id, "role": "worker"})))
    products = len(list(product_collection.find({"branch_id": branch_id})))

    orders = list(order_collection.find({"branch_id": branch_id}))
    customer_emails = {o.get("user_email") for o in orders if o.get("user_email")}
    revenue = sum(parse_price(o.get("total")) for o in orders)

    return {
        "admins": admins,
        "workers": workers,
        "staff": admins + workers,
        "customers": len(customer_emails),
        "products": products,
        "orders": len(orders),
        "revenue": format_naira(revenue),
    }


def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    payload = decode_token(authorization.split(" ")[1])
    if not payload or not payload.get("email"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    user = user_collection.find_one({"email": payload["email"]})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists",
        )
    return user


def require_super_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required",
        )
    return user


def require_branch_admin(user: dict = Depends(get_current_user)):
    if user.get("role") not in ("super_admin", "branch_admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Branch admin access required",
        )
    return user


def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") not in ("super_admin", "branch_admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user


def require_staff(user: dict = Depends(get_current_user)):
    if user.get("role") not in ("super_admin", "branch_admin", "worker"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Staff access required",
        )
    return user


# ─── Root ───────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Hello World"}


# ─── Auth ───────────────────────────────────────────────────────────────

@app.post("/register")
def Register(user: User):
    user_data = dict(user)
    already_existed_user_check = user_collection.find_one({"email": user_data["email"]})
    if already_existed_user_check:
        return JSONResponse(
            {"message": "User already exists"},
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    existing_super_admin = user_collection.find_one({"role": "super_admin"})
    if not existing_super_admin and user_data["email"].lower() == ADMIN_EMAIL:
        role = "super_admin"
    else:
        role = "user"

    user_data["role"] = role
    user_data["password"] = hash_password(user_data["password"])
    user_collection.insert_one(user_data)
    return JSONResponse(
        {"message": "User registered successfully", "role": role},
        status_code=status.HTTP_200_OK,
    )


@app.post("/login", response_model=LoginResponse)
def login(user: Login):
    user_data = dict(user)
    user_check = user_collection.find_one({"email": user_data["email"]})
    if not user_check:
        return JSONResponse(
            {"message": "User not found"},
            status_code=status.HTTP_401_UNAUTHORIZED,
        )
    if not verify_password(user_check["password"], user_data["password"]):
        return JSONResponse(
            {"message": "Invalid credentials"},
            status_code=status.HTTP_401_UNAUTHORIZED,
        )
    role = user_check.get("role", "user")
    branch_id = user_check.get("branch_id")
    token = create_access_token(user_check["email"], role, branch_id)
    return LoginResponse(access_token=token, role=role, user=UserPublic(**public_user(user_check)))


@app.get("/me")
def me(user: dict = Depends(get_current_user)):
    return public_user(user)


@app.put("/me")
def update_profile(update: ProfileUpdate, user: dict = Depends(get_current_user)):
    changes = {k: v for k, v in dict(update).items() if v is not None}
    if not changes:
        return JSONResponse({"message": "Nothing to update"}, status_code=status.HTTP_400_BAD_REQUEST)
    user_collection.update_one({"email": user["email"]}, {"$set": changes})
    updated = user_collection.find_one({"email": user["email"]})
    return public_user(updated)


@app.put("/me/password")
def change_password(update: PasswordUpdate, user: dict = Depends(get_current_user)):
    if not verify_password(user["password"], update.current_password):
        return JSONResponse(
            {"message": "Current password is incorrect"},
            status_code=status.HTTP_401_UNAUTHORIZED,
        )
    user_collection.update_one(
        {"email": user["email"]},
        {"$set": {"password": hash_password(update.new_password)}},
    )
    return JSONResponse({"message": "Password updated successfully"}, status_code=status.HTTP_200_OK)


# ─── Branches (Super Admin) ────────────────────────────────────────────

@app.post("/branches")
def create_branch(branch: Branch, admin: dict = Depends(require_super_admin)):
    data = dict(branch)
    branch_id = branch.name.lower().replace(" ", "-")
    existing = branch_collection.find_one({"_id": branch_id})
    if existing:
        return JSONResponse(
            {"message": "Branch already exists"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    data["_id"] = branch_id
    branch_collection.insert_one(data)
    return serialize_branch(branch_collection.find_one({"_id": branch_id}))


@app.get("/branches")
def list_branches(admin: dict = Depends(require_super_admin)):
    docs = branch_collection.find({})
    branches = []
    for doc in docs:
        branch = serialize_branch(doc)
        branch["stats"] = branch_stats(branch["id"])
        branches.append(branch)
    return branches


@app.get("/branches/{branch_id}")
def get_branch(branch_id: str, admin: dict = Depends(require_admin)):
    doc = branch_collection.find_one({"_id": branch_id})
    if not doc:
        return JSONResponse(
            {"message": "Branch not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    return serialize_branch(doc)


@app.put("/branches/{branch_id}")
def update_branch(branch_id: str, update: BranchUpdate, admin: dict = Depends(require_super_admin)):
    existing = branch_collection.find_one({"_id": branch_id})
    if not existing:
        return JSONResponse(
            {"message": "Branch not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    changes = {k: v for k, v in dict(update).items() if v is not None}
    if changes:
        branch_collection.update_one({"_id": branch_id}, {"$set": changes})
    return serialize_branch(branch_collection.find_one({"_id": branch_id}))


@app.delete("/branches/{branch_id}")
def delete_branch(branch_id: str, admin: dict = Depends(require_super_admin)):
    existing = branch_collection.find_one({"_id": branch_id})
    if not existing:
        return JSONResponse(
            {"message": "Branch not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    branch_collection.delete_one({"_id": branch_id})
    user_collection.delete_many({"branch_id": branch_id})
    product_collection.delete_many({"branch_id": branch_id})
    order_collection.delete_many({"branch_id": branch_id})
    return JSONResponse({"message": "Branch deleted successfully"}, status_code=status.HTTP_200_OK)


# ─── Workers (Branch Admin) ────────────────────────────────────────────

@app.post("/branches/{branch_id}/workers")
def add_worker(branch_id: str, worker: WorkerCreate, admin: dict = Depends(require_branch_admin)):
    branch = branch_collection.find_one({"_id": branch_id})
    if not branch:
        return JSONResponse(
            {"message": "Branch not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    if admin.get("role") == "branch_admin" and admin.get("branch_id") != branch_id:
        return JSONResponse(
            {"message": "You can only manage your own branch"},
            status_code=status.HTTP_403_FORBIDDEN,
        )

    existing = user_collection.find_one({"email": worker.email})
    if existing:
        return JSONResponse(
            {"message": "User with this email already exists"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    user_data = {
        "name": worker.name,
        "age": worker.age,
        "email": worker.email,
        "password": hash_password(worker.password),
        "role": "worker",
        "branch_id": branch_id,
    }
    user_collection.insert_one(user_data)
    return JSONResponse(
        {"message": "Worker added successfully"},
        status_code=status.HTTP_200_OK,
    )


@app.get("/branches/{branch_id}/workers")
def list_workers(branch_id: str, admin: dict = Depends(require_branch_admin)):
    branch = branch_collection.find_one({"_id": branch_id})
    if not branch:
        return JSONResponse(
            {"message": "Branch not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    if admin.get("role") == "branch_admin" and admin.get("branch_id") != branch_id:
        return JSONResponse(
            {"message": "You can only manage your own branch"},
            status_code=status.HTTP_403_FORBIDDEN,
        )

    docs = user_collection.find({"branch_id": branch_id, "role": "worker"})
    workers = []
    for doc in docs:
        u = public_user(doc)
        u["id"] = str(doc.get("_id"))
        workers.append(u)
    return workers


@app.delete("/branches/{branch_id}/workers/{worker_email}")
def remove_worker(branch_id: str, worker_email: str, admin: dict = Depends(require_branch_admin)):
    branch = branch_collection.find_one({"_id": branch_id})
    if not branch:
        return JSONResponse(
            {"message": "Branch not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    if admin.get("role") == "branch_admin" and admin.get("branch_id") != branch_id:
        return JSONResponse(
            {"message": "You can only manage your own branch"},
            status_code=status.HTTP_403_FORBIDDEN,
        )

    result = user_collection.delete_one({"email": worker_email, "branch_id": branch_id, "role": "worker"})
    if result.deleted_count == 0:
        return JSONResponse(
            {"message": "Worker not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    return JSONResponse({"message": "Worker removed successfully"}, status_code=status.HTTP_200_OK)


@app.post("/branches/{branch_id}/assign-admin")
def assign_branch_admin(branch_id: str, body: dict, admin: dict = Depends(require_super_admin)):
    branch = branch_collection.find_one({"_id": branch_id})
    if not branch:
        return JSONResponse(
            {"message": "Branch not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    email = body.get("email")
    if not email:
        return JSONResponse(
            {"message": "Email is required"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    user = user_collection.find_one({"email": email})
    if not user:
        return JSONResponse(
            {"message": "User not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    user_collection.update_one(
        {"email": email},
        {"$set": {"role": "branch_admin", "branch_id": branch_id}},
    )
    return JSONResponse({"message": f"User {email} is now branch admin for {branch_id}"}, status_code=status.HTTP_200_OK)


@app.get("/branches/{branch_id}/overview")
def branch_overview(branch_id: str, admin: dict = Depends(require_super_admin)):
    branch = branch_collection.find_one({"_id": branch_id})
    if not branch:
        return JSONResponse(
            {"message": "Branch not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )

    workers = list(user_collection.find({"branch_id": branch_id, "role": "worker"}))
    admins = list(user_collection.find({"branch_id": branch_id, "role": "branch_admin"}))
    orders = list(order_collection.find({"branch_id": branch_id}))
    products = list(product_collection.find({"branch_id": branch_id}))

    recent_orders = []
    for order in orders:
        recent_orders.append({
            "id": str(order.get("_id")),
            "user_name": order.get("user_name", ""),
            "user_email": order.get("user_email", ""),
            "total": order.get("total", ""),
            "status": order.get("status", ""),
            "created_at": order.get("created_at", ""),
        })
    recent_orders.sort(key=lambda o: o.get("created_at") or "", reverse=True)

    status_counts = {}
    for order in orders:
        status = order.get("status", "Pending")
        status_counts[status] = status_counts.get(status, 0) + 1

    return {
        "branch": serialize_branch(branch),
        "stats": branch_stats(branch_id),
        "status_counts": status_counts,
        "admins": [{**public_user(a), "id": str(a.get("_id"))} for a in admins],
        "workers": [{**public_user(w), "id": str(w.get("_id"))} for w in workers],
        "products": [serialize_product(p) for p in products],
        "orders": recent_orders[:20],
    }


# ─── Products ───────────────────────────────────────────────────────────

@app.get("/products")
def list_products(user: dict = Depends(get_current_user)):
    query = {}
    if user.get("role") in ("branch_admin", "worker") and user.get("branch_id"):
        query["branch_id"] = user["branch_id"]
    elif user.get("role") == "super_admin":
        branch_id = user.get("branch_id")
        if branch_id:
            query["branch_id"] = branch_id
    docs = product_collection.find(query)
    products = [serialize_product(doc) for doc in docs]
    return products


@app.post("/products")
def create_product(product: Product, admin: dict = Depends(require_branch_admin)):
    data = dict(product)
    branch_id = admin.get("branch_id")
    if admin.get("role") == "super_admin" and not branch_id:
        return JSONResponse(
            {"message": "Super admin must be assigned to a branch to create products"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    data["branch_id"] = branch_id
    product_id = f"{branch_id}-{data['name'].lower().replace(' ', '-')}"
    existing = product_collection.find_one({"_id": product_id})
    if existing:
        return JSONResponse(
            {"message": "Product already exists in this branch"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    data["_id"] = product_id
    product_collection.insert_one(data)
    return serialize_product(product_collection.find_one({"_id": product_id}))


@app.put("/products/{product_id}")
def update_product(product_id: str, product: Product, admin: dict = Depends(require_branch_admin)):
    existing = product_collection.find_one({"_id": product_id})
    if not existing:
        return JSONResponse(
            {"message": "Product not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    branch_id = admin.get("branch_id")
    if admin.get("role") != "super_admin" and existing.get("branch_id") != branch_id:
        return JSONResponse(
            {"message": "You can only manage products in your branch"},
            status_code=status.HTTP_403_FORBIDDEN,
        )
    product_collection.update_one({"_id": product_id}, {"$set": dict(product)})
    return serialize_product(product_collection.find_one({"_id": product_id}))


@app.delete("/products/{product_id}")
def delete_product(product_id: str, admin: dict = Depends(require_branch_admin)):
    existing = product_collection.find_one({"_id": product_id})
    if not existing:
        return JSONResponse(
            {"message": "Product not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    branch_id = admin.get("branch_id")
    if admin.get("role") != "super_admin" and existing.get("branch_id") != branch_id:
        return JSONResponse(
            {"message": "You can only manage products in your branch"},
            status_code=status.HTTP_403_FORBIDDEN,
        )
    result = product_collection.delete_one({"_id": product_id})
    if result.deleted_count == 0:
        return JSONResponse(
            {"message": "Product not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    return JSONResponse({"message": "Product deleted successfully"}, status_code=status.HTTP_200_OK)


@app.post("/seed-products")
def seed_products(admin: dict = Depends(require_branch_admin)):
    branch_id = admin.get("branch_id")
    if admin.get("role") == "super_admin" and not branch_id:
        return JSONResponse(
            {"message": "Super admin must be assigned to a branch to seed products"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    products = [
        {"name": "Broiler Chicken", "weight": "1.5 - 2 kg", "price": "₦4,500", "img": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80", "category": "Chicken", "tag": "Best Seller"},
        {"name": "Layer Chicken", "weight": "2 - 2.5 kg", "price": "₦5,200", "img": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80", "category": "Chicken", "tag": "Popular"},
        {"name": "Fresh Turkey", "weight": "4 - 6 kg", "price": "₦12,000", "img": "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&q=80", "category": "Turkey", "tag": "Premium"},
        {"name": "Day Old Chicks", "weight": "Pack of 50", "price": "₦15,000", "img": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80", "category": "Chicks", "tag": "New"},
        {"name": "Fresh Eggs", "weight": "Crate (30)", "price": "₦2,800", "img": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80", "category": "Eggs", "tag": "Value"},
        {"name": "Organic Chicken", "weight": "2 - 3 kg", "price": "₦7,000", "img": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80", "category": "Chicken", "tag": "Organic"},
    ]
    added = 0
    for p in products:
        product_id = f"{branch_id}-{p['name'].lower().replace(' ', '-')}"
        if not product_collection.find_one({"_id": product_id}):
            p["_id"] = product_id
            p["branch_id"] = branch_id
            product_collection.insert_one(p)
            added += 1
    return JSONResponse({"message": f"{added} products seeded"}, status_code=status.HTTP_200_OK)


# ─── Orders ─────────────────────────────────────────────────────────────

@app.post("/orders")
def create_order(order: Order, user: dict = Depends(get_current_user)):
    total = sum(parse_price(item.price) * item.quantity for item in order.items)
    branch_id = order.branch_id or user.get("branch_id")
    if branch_id and not branch_collection.find_one({"_id": branch_id}):
        branch_id = None
    doc = {
        "user_email": user["email"],
        "user_name": user.get("name", ""),
        "items": [item.model_dump() for item in order.items],
        "total": format_naira(total),
        "status": "Pending",
        "branch_id": branch_id,
        "created_at": "",
    }
    from datetime import datetime, timezone
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    result = order_collection.insert_one(doc)
    return JSONResponse(
        {"message": "Order placed successfully", "order_id": str(result.inserted_id)},
        status_code=status.HTTP_200_OK,
    )


@app.get("/orders")
def my_orders(user: dict = Depends(get_current_user)):
    query = {"user_email": user["email"]}
    docs = order_collection.find(query)
    orders = []
    for doc in docs:
        doc["id"] = str(doc.get("_id"))
        doc.pop("_id", None)
        orders.append(doc)
    return orders


@app.get("/orders/{order_id}")
def get_order(order_id: str, user: dict = Depends(get_current_user)):
    from bson import ObjectId
    try:
        doc = order_collection.find_one({"_id": ObjectId(order_id), "user_email": user["email"]})
    except Exception:
        return JSONResponse(
            {"message": "Invalid order ID"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    if not doc:
        return JSONResponse(
            {"message": "Order not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    doc["id"] = str(doc.pop("_id"))
    return doc


@app.put("/orders/{order_id}/cancel")
def cancel_order(order_id: str, user: dict = Depends(get_current_user)):
    from bson import ObjectId
    try:
        doc = order_collection.find_one({"_id": ObjectId(order_id), "user_email": user["email"]})
    except Exception:
        return JSONResponse(
            {"message": "Invalid order ID"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    if not doc:
        return JSONResponse(
            {"message": "Order not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    if doc.get("status") != "Pending":
        return JSONResponse(
            {"message": "Only pending orders can be cancelled"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    order_collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": "Cancelled"}},
    )
    return JSONResponse({"message": "Order cancelled successfully"}, status_code=status.HTTP_200_OK)


@app.put("/orders/{order_id}/status")
def update_order_status(order_id: str, body: dict, admin: dict = Depends(require_branch_admin)):
    from bson import ObjectId
    try:
        doc = order_collection.find_one({"_id": ObjectId(order_id)})
    except Exception:
        return JSONResponse(
            {"message": "Invalid order ID"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    if not doc:
        return JSONResponse(
            {"message": "Order not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    branch_id = admin.get("branch_id")
    if admin.get("role") != "super_admin" and doc.get("branch_id") != branch_id:
        return JSONResponse(
            {"message": "You can only manage orders in your branch"},
            status_code=status.HTTP_403_FORBIDDEN,
        )
    new_status = body.get("status")
    if new_status not in ("Pending", "Processing", "Delivered", "Cancelled"):
        return JSONResponse(
            {"message": "Invalid status"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    order_collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": new_status}},
    )
    return JSONResponse({"message": "Order status updated"}, status_code=status.HTTP_200_OK)


@app.get("/dashboard/stats")
def dashboard_stats(user: dict = Depends(get_current_user)):
    query = {"user_email": user["email"]}
    orders = list(order_collection.find(query))
    total_spent = sum(parse_price(doc.get("total")) for doc in orders)
    pending = sum(1 for doc in orders if doc.get("status") == "Pending")
    delivered = sum(1 for doc in orders if doc.get("status") == "Delivered")
    return {
        "total_orders": len(orders),
        "total_spent": format_naira(total_spent),
        "pending_orders": pending,
        "delivered_orders": delivered,
    }


@app.post("/contact")
def submit_contact(contact: Contact):
    from datetime import datetime, timezone
    doc = dict(contact)
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    contact_collection.insert_one(doc)
    return JSONResponse(
        {"message": "Message sent successfully"},
        status_code=status.HTTP_200_OK,
    )


# ─── Admin Stats (Branch-scoped) ───────────────────────────────────────

@app.get("/admin/stats")
def admin_stats(user: dict = Depends(require_branch_admin)):
    branch_id = user.get("branch_id")

    if branch_id:
        users = list(user_collection.find({"branch_id": branch_id}))
        product_count = len(list(product_collection.find({"branch_id": branch_id})))
        orders = list(order_collection.find({"branch_id": branch_id}))
    else:
        users = list(user_collection.find({}))
        product_count = len(list(product_collection.find({})))
        orders = list(order_collection.find({}))

    revenue = sum(parse_price(doc.get("total")) for doc in orders)
    return {
        "users": len(users),
        "products": product_count,
        "orders": len(orders),
        "revenue": format_naira(revenue),
    }


# ─── Admin Users (Branch-scoped) ──────────────────────────────────────

@app.get("/admin/users")
def admin_users(admin: dict = Depends(require_branch_admin)):
    role = admin.get("role")
    branch_id = admin.get("branch_id")

    if role == "super_admin" and not branch_id:
        docs = list(user_collection.find({}))
    elif branch_id:
        users_by_email = {}
        for doc in user_collection.find({"branch_id": branch_id}):
            if doc.get("email"):
                users_by_email[doc["email"]] = doc

        order_emails = set()
        for order in order_collection.find({"branch_id": branch_id}):
            email = order.get("user_email")
            if email:
                order_emails.add(email)

        for email in order_emails:
            if email not in users_by_email:
                customer = user_collection.find_one({"email": email})
                if customer:
                    users_by_email[email] = customer

        docs = list(users_by_email.values())
    else:
        docs = list(user_collection.find({}))

    users = []
    for doc in docs:
        u = public_user(doc)
        u["id"] = str(doc.get("_id"))
        users.append(u)
    return users


# ─── Admin Orders (Branch-scoped) ─────────────────────────────────────

@app.get("/admin/orders")
def admin_orders(admin: dict = Depends(require_branch_admin)):
    branch_id = admin.get("branch_id")
    if admin.get("role") == "super_admin" and not branch_id:
        docs = order_collection.find({})
    elif branch_id:
        docs = order_collection.find({"branch_id": branch_id})
    else:
        docs = order_collection.find({})

    orders = []
    for doc in docs:
        doc["id"] = str(doc.get("_id"))
        doc.pop("_id", None)
        orders.append(doc)
    return orders


# ─── Worker (Branch-scoped orders) ────────────────────────────────────

@app.get("/worker/stats")
def worker_stats(user: dict = Depends(require_staff)):
    branch_id = user.get("branch_id")
    orders = list(order_collection.find({"branch_id": branch_id})) if branch_id else []
    branch = branch_collection.find_one({"_id": branch_id}) if branch_id else None

    status_counts = {}
    for order in orders:
        status = order.get("status", "Pending")
        status_counts[status] = status_counts.get(status, 0) + 1

    revenue = sum(parse_price(o.get("total")) for o in orders)

    return {
        "branch": serialize_branch(branch) if branch else None,
        "orders": len(orders),
        "status_counts": status_counts,
        "revenue": format_naira(revenue),
    }


@app.get("/worker/orders")
def worker_orders(user: dict = Depends(require_staff)):
    branch_id = user.get("branch_id")
    if not branch_id:
        return []
    docs = order_collection.find({"branch_id": branch_id})
    orders = []
    for doc in docs:
        doc["id"] = str(doc.get("_id"))
        doc.pop("_id", None)
        orders.append(doc)
    orders.sort(key=lambda o: o.get("created_at") or "", reverse=True)
    return orders


@app.put("/worker/orders/{order_id}/status")
def worker_update_order_status(order_id: str, body: dict, user: dict = Depends(require_staff)):
    from bson import ObjectId
    try:
        doc = order_collection.find_one({"_id": ObjectId(order_id)})
    except Exception:
        return JSONResponse(
            {"message": "Invalid order ID"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    if not doc:
        return JSONResponse(
            {"message": "Order not found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    if user.get("role") != "super_admin" and doc.get("branch_id") != user.get("branch_id"):
        return JSONResponse(
            {"message": "You can only manage orders in your branch"},
            status_code=status.HTTP_403_FORBIDDEN,
        )
    new_status = body.get("status")
    if new_status not in ("Pending", "Processing", "Delivered", "Cancelled"):
        return JSONResponse(
            {"message": "Invalid status"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    order_collection.update_one({"_id": ObjectId(order_id)}, {"$set": {"status": new_status}})
    return JSONResponse({"message": "Order status updated"}, status_code=status.HTTP_200_OK)


# ─── Public: Branch-scoped products for shopping ───────────────────────

@app.get("/shop/products")
def shop_products(branch_id: str = None):
    if not branch_id:
        return []
    docs = product_collection.find({"branch_id": branch_id})
    return [serialize_product(doc) for doc in docs]


@app.get("/shop/branches")
def shop_branches():
    docs = branch_collection.find({})
    return [serialize_branch(doc) for doc in docs]


# ─── Demo Data ─────────────────────────────────────────────────────────

DEMO_BRANCHES = [
    {"_id": "ikeja-branch", "name": "Ikeja Branch", "address": "12 Allen Avenue, Ikeja, Lagos", "phone": "+234 801 234 5678"},
    {"_id": "lekki-branch", "name": "Lekki Branch", "address": "5 Admiralty Way, Lekki Phase 1, Lagos", "phone": "+234 802 345 6789"},
    {"_id": "yaba-branch", "name": "Yaba Branch", "address": "22 Herbert Macaulay Way, Yaba, Lagos", "phone": "+234 803 456 7890"},
    {"_id": "surulere-branch", "name": "Surulere Branch", "address": "8 Bode Thomas Street, Surulere, Lagos", "phone": "+234 804 567 8901"},
]

DEMO_ACCOUNTS = [
    {"name": "Super Admin", "age": 35, "email": "superadmin@greenfields.com", "password": "Super@123", "role": "super_admin", "branch_id": None},
    {"name": "Ikeja Admin", "age": 31, "email": "admin.ikeja@greenfields.com", "password": "Admin@123", "role": "branch_admin", "branch_id": "ikeja-branch"},
    {"name": "Lekki Admin", "age": 29, "email": "admin.lekki@greenfields.com", "password": "Admin@123", "role": "branch_admin", "branch_id": "lekki-branch"},
    {"name": "Yaba Admin", "age": 34, "email": "admin.yaba@greenfields.com", "password": "Admin@123", "role": "branch_admin", "branch_id": "yaba-branch"},
    {"name": "Surulere Admin", "age": 27, "email": "admin.surulere@greenfields.com", "password": "Admin@123", "role": "branch_admin", "branch_id": "surulere-branch"},
    {"name": "Farm Worker", "age": 25, "email": "worker@greenfields.com", "password": "worker123", "role": "worker", "branch_id": "ikeja-branch"},
    {"name": "Joy Customer", "age": 28, "email": "user@greenfields.com", "password": "user123", "role": "user", "branch_id": None},
    {"name": "Ada Buyer", "age": 33, "email": "ada@greenfields.com", "password": "buyer123", "role": "user", "branch_id": None},
    {"name": "Musa Trader", "age": 41, "email": "musa@greenfields.com", "password": "buyer123", "role": "user", "branch_id": None},
]

DEMO_ORDERS = [
    {"branch_id": "ikeja-branch", "user_email": "user@greenfields.com", "user_name": "Joy Customer", "status": "Delivered", "days_ago": 6, "items": [("Broiler Chicken", 2), ("Fresh Eggs", 1)]},
    {"branch_id": "ikeja-branch", "user_email": "ada@greenfields.com", "user_name": "Ada Buyer", "status": "Pending", "days_ago": 1, "items": [("Fresh Turkey", 1)]},
    {"branch_id": "lekki-branch", "user_email": "musa@greenfields.com", "user_name": "Musa Trader", "status": "Processing", "days_ago": 3, "items": [("Layer Chicken", 3), ("Organic Chicken", 1)]},
    {"branch_id": "lekki-branch", "user_email": "user@greenfields.com", "user_name": "Joy Customer", "status": "Pending", "days_ago": 0, "items": [("Fresh Eggs", 2)]},
    {"branch_id": "yaba-branch", "user_email": "ada@greenfields.com", "user_name": "Ada Buyer", "status": "Delivered", "days_ago": 8, "items": [("Day Old Chicks", 1), ("Broiler Chicken", 1)]},
    {"branch_id": "surulere-branch", "user_email": "musa@greenfields.com", "user_name": "Musa Trader", "status": "Cancelled", "days_ago": 5, "items": [("Broiler Chicken", 1)]},
    {"branch_id": "surulere-branch", "user_email": "user@greenfields.com", "user_name": "Joy Customer", "status": "Delivered", "days_ago": 12, "items": [("Fresh Turkey", 1), ("Fresh Eggs", 3)]},
]

DEMO_PRODUCTS = [
    {"name": "Broiler Chicken", "weight": "1.5 - 2 kg", "price": "₦4,500", "img": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80", "category": "Chicken", "tag": "Best Seller"},
    {"name": "Layer Chicken", "weight": "2 - 2.5 kg", "price": "₦5,200", "img": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80", "category": "Chicken", "tag": "Popular"},
    {"name": "Fresh Turkey", "weight": "4 - 6 kg", "price": "₦12,000", "img": "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&q=80", "category": "Turkey", "tag": "Premium"},
    {"name": "Day Old Chicks", "weight": "Pack of 50", "price": "₦15,000", "img": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80", "category": "Chicks", "tag": "New"},
    {"name": "Fresh Eggs", "weight": "Crate (30)", "price": "₦2,800", "img": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80", "category": "Eggs", "tag": "Value"},
    {"name": "Organic Chicken", "weight": "2 - 3 kg", "price": "₦7,000", "img": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80", "category": "Chicken", "tag": "Organic"},
]


def seed_demo_orders():
    from datetime import datetime, timezone, timedelta

    added = 0
    for index, spec in enumerate(DEMO_ORDERS):
        demo_key = f"{spec['branch_id']}:{spec['user_email']}:{index}"
        if order_collection.find_one({"demo_key": demo_key}):
            continue

        items = []
        total = 0.0
        for name, quantity in spec["items"]:
            product_id = f"{spec['branch_id']}-{name.lower().replace(' ', '-')}"
            product = product_collection.find_one({"_id": product_id})
            if not product:
                continue
            items.append({
                "product_id": product_id,
                "name": product.get("name", name),
                "weight": product.get("weight", ""),
                "price": product.get("price", ""),
                "quantity": quantity,
            })
            total += parse_price(product.get("price")) * quantity

        if not items:
            continue

        created = datetime.now(timezone.utc) - timedelta(days=spec["days_ago"])
        order_collection.insert_one({
            "user_email": spec["user_email"],
            "user_name": spec["user_name"],
            "items": items,
            "total": format_naira(total),
            "status": spec["status"],
            "branch_id": spec["branch_id"],
            "created_at": created.isoformat(),
            "demo_key": demo_key,
        })
        added += 1

    return added


@app.post("/seed-demo")
def seed_demo():
    for branch in DEMO_BRANCHES:
        if not branch_collection.find_one({"_id": branch["_id"]}):
            branch_collection.insert_one(dict(branch))

    for account in DEMO_ACCOUNTS:
        if not user_collection.find_one({"email": account["email"]}):
            doc = dict(account)
            doc["password"] = hash_password(doc["password"])
            user_collection.insert_one(doc)

    for branch in DEMO_BRANCHES:
        branch_id = branch["_id"]
        for product in DEMO_PRODUCTS:
            product_id = f"{branch_id}-{product['name'].lower().replace(' ', '-')}"
            if not product_collection.find_one({"_id": product_id}):
                doc = dict(product)
                doc["_id"] = product_id
                doc["branch_id"] = branch_id
                product_collection.insert_one(doc)

    orders_added = seed_demo_orders()

    return JSONResponse(
        {
            "message": "Demo data ready",
            "branches": [b["name"] for b in DEMO_BRANCHES],
            "orders_added": orders_added,
            "accounts": [
                {"email": a["email"], "password": a["password"], "role": a["role"], "branch_id": a["branch_id"]}
                for a in DEMO_ACCOUNTS
            ],
        },
        status_code=status.HTTP_200_OK,
    )


@app.get("/demo-accounts")
def demo_accounts():
    return [
        {"email": a["email"], "password": a["password"], "role": a["role"], "name": a["name"], "branch_id": a["branch_id"]}
        for a in DEMO_ACCOUNTS
    ]
