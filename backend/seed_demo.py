from app import DEMO_ACCOUNTS, seed_demo

if __name__ == "__main__":
    seed_demo()
    print("Demo data ready. Login credentials:")
    print("-" * 64)
    for account in DEMO_ACCOUNTS:
        print(f"  {account['role']:<13} {account['email']:<32} {account['password']}")
    print("-" * 64)
