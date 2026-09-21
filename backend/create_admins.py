from db import user_collection, branch_collection, product_collection
from utils import hash_password

BRANCHES = [
    {"_id": "ikeja-branch", "name": "Ikeja Branch", "address": "12 Allen Avenue, Ikeja, Lagos", "phone": "+234 801 234 5678"},
    {"_id": "lekki-branch", "name": "Lekki Branch", "address": "5 Admiralty Way, Lekki Phase 1, Lagos", "phone": "+234 802 345 6789"},
    {"_id": "yaba-branch", "name": "Yaba Branch", "address": "22 Herbert Macaulay Way, Yaba, Lagos", "phone": "+234 803 456 7890"},
    {"_id": "surulere-branch", "name": "Surulere Branch", "address": "8 Bode Thomas Street, Surulere, Lagos", "phone": "+234 804 567 8901"},
]

ADMINS = [
    {"name": "Ikeja Admin", "age": 31, "email": "admin.ikeja@greenfields.com", "password": "Admin@123", "branch_id": "ikeja-branch"},
    {"name": "Lekki Admin", "age": 29, "email": "admin.lekki@greenfields.com", "password": "Admin@123", "branch_id": "lekki-branch"},
    {"name": "Yaba Admin", "age": 34, "email": "admin.yaba@greenfields.com", "password": "Admin@123", "branch_id": "yaba-branch"},
    {"name": "Surulere Admin", "age": 27, "email": "admin.surulere@greenfields.com", "password": "Admin@123", "branch_id": "surulere-branch"},
]

SUPER_ADMIN = {
    "name": "Super Admin",
    "age": 35,
    "email": "superadmin@greenfields.com",
    "password": "Super@123",
    "branch_id": None,
}

PRODUCTS = [
    {"name": "Broiler Chicken", "weight": "1.5 - 2 kg", "price": "₦4,500", "img": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80", "category": "Chicken", "tag": "Best Seller"},
    {"name": "Layer Chicken", "weight": "2 - 2.5 kg", "price": "₦5,200", "img": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80", "category": "Chicken", "tag": "Popular"},
    {"name": "Fresh Turkey", "weight": "4 - 6 kg", "price": "₦12,000", "img": "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&q=80", "category": "Turkey", "tag": "Premium"},
    {"name": "Day Old Chicks", "weight": "Pack of 50", "price": "₦15,000", "img": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80", "category": "Chicks", "tag": "New"},
    {"name": "Fresh Eggs", "weight": "Crate (30)", "price": "₦2,800", "img": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80", "category": "Eggs", "tag": "Value"},
    {"name": "Organic Chicken", "weight": "2 - 3 kg", "price": "₦7,000", "img": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80", "category": "Chicken", "tag": "Organic"},
]


def upsert_branch(branch):
    fields = {k: v for k, v in branch.items() if k != "_id"}
    if branch_collection.find_one({"_id": branch["_id"]}):
        branch_collection.update_one({"_id": branch["_id"]}, {"$set": fields})
    else:
        branch_collection.insert_one(dict(branch))


def upsert_user(user, role):
    doc = {
        "name": user["name"],
        "age": user["age"],
        "email": user["email"],
        "password": hash_password(user["password"]),
        "role": role,
        "branch_id": user["branch_id"],
    }
    existing = user_collection.find_one({"email": user["email"]})
    if existing:
        user_collection.update_one({"email": user["email"]}, {"$set": doc})
    else:
        user_collection.insert_one(doc)


def seed_branch_products(branch_id):
    for product in PRODUCTS:
        product_id = f"{branch_id}-{product['name'].lower().replace(' ', '-')}"
        doc = dict(product)
        doc["_id"] = product_id
        doc["branch_id"] = branch_id
        if product_collection.find_one({"_id": product_id}):
            fields = {k: v for k, v in doc.items() if k != "_id"}
            product_collection.update_one({"_id": product_id}, {"$set": fields})
        else:
            product_collection.insert_one(doc)


if __name__ == "__main__":
    for branch in BRANCHES:
        upsert_branch(branch)

    for admin in ADMINS:
        upsert_user(admin, "branch_admin")
        seed_branch_products(admin["branch_id"])

    upsert_user(SUPER_ADMIN, "super_admin")

    print("Super admin ready:")
    print("-" * 72)
    print(f"  {'ROLE':<18} {'EMAIL':<30} {'PASSWORD'}")
    print("-" * 72)
    print(f"  {'super admin':<18} {SUPER_ADMIN['email']:<30} {SUPER_ADMIN['password']}")
    print()
    print("Four branch admins ready:")
    print("-" * 72)
    print(f"  {'BRANCH':<18} {'EMAIL':<30} {'PASSWORD'}")
    print("-" * 72)
    for admin in ADMINS:
        branch_name = next(b["name"] for b in BRANCHES if b["_id"] == admin["branch_id"])
        print(f"  {branch_name:<18} {admin['email']:<30} {admin['password']}")
    print("-" * 72)
