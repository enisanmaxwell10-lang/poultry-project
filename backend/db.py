import os
import time
from astrapy import DataAPIClient

client = DataAPIClient()
db = client.get_database(
  os.environ.get("ASTRA_DB_URL", "https://ff334674-9642-4ec3-8881-946710ffcc58-us-east-2.apps.astra.datastax.com"),
  token=os.environ["ASTRA_DB_TOKEN"]
)


def _get_or_create_collection(name, attempts=5):
    last_error = None
    for attempt in range(attempts):
        try:
            try:
                return db.get_collection(name)
            except Exception:
                return db.create_collection(name)
        except Exception as error:
            last_error = error
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"Could not connect to collection '{name}': {last_error}")


user_collection = _get_or_create_collection("users")
product_collection = _get_or_create_collection("products")
order_collection = _get_or_create_collection("orders")
contact_collection = _get_or_create_collection("contacts")
branch_collection = _get_or_create_collection("branches")

print(f"Connected to Astra DB: {db.list_collection_names()}")
