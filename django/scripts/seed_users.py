import random

import requests
from faker import Faker

fake = Faker('en_IN')

def populate_test_users(count=25):
    url = "http://localhost:8000/api/users/auth/register/"
    print(f"Generating {count} realistic test users...")

    for _ in range(count):
        first_name = fake.first_name()
        last_name = fake.last_name()

        domain = fake.free_email_domain()
        email = f"{first_name.lower()}.{last_name.lower()}{random.randint(10, 999)}@{domain}"
        phone_number = f"{random.randint(6, 9)}{fake.random_number(digits=9, fix_len=True)}"

        payload = {
            "first_name": first_name,
            "middle_name": "",
            "last_name": last_name,
            "email": email,
            "phone_number": phone_number,
            "password": "testpassword"
        }

        try:
            response = requests.post(url, json=payload)
            if response.status_code == 201:
                print(f"Added: {first_name} {last_name} | {email}")
            else:
                print(f"Failed to add {email} | Reason: {response.text}")
        except requests.exceptions.ConnectionError:
            print("\nError: Could not connect. Make sure your Django server is running.")
            break

if __name__ == "__main__":
    populate_test_users(50)
