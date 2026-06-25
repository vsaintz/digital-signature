import math
import random

import requests

BASE_URL = "http://localhost:8000/api"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "adminpassword"
TEST_USER_PASSWORD = "testpassword"
PAGE_SIZE = 10

def get_admin_token():
    url = f"{BASE_URL}/users/auth/login/"
    try:
        response = requests.post(url, json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        if response.status_code == 200:
            return response.json().get("access")
        else:
            print(f"Admin authentication failed ({response.status_code}): {response.text}")
            return None
    except requests.exceptions.ConnectionError:
        print("Could not connect to the server. Is Django running?")
        return None

def fetch_randomized_user_pool(token, target_count):
    init_url = f"{BASE_URL}/users/admin/list/?page=1"
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(init_url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch user list ({response.status_code})")
            return []

        data = response.json()
        total_users = data.get("count", 0)
        if total_users == 0:
            return []
        total_pages = math.ceil(total_users / PAGE_SIZE)
        pages = list(range(1, total_pages + 1))
        random.shuffle(pages)
        collected_users = []

        print(f"Discovered {total_users} total users across {total_pages} pages.")
        print("Gathering a random pool of users...")

        for page_num in pages:
            if len(collected_users) >= target_count:
                break

            page_url = f"{BASE_URL}/users/admin/list/?page={page_num}"
            page_res = requests.get(page_url, headers=headers)

            if page_res.status_code == 200:
                results = page_res.json().get("results", [])
                valid_users = [u for u in results if u.get("email") != ADMIN_EMAIL]
                collected_users.extend(valid_users)

        random.shuffle(collected_users)
        return collected_users[:target_count]

    except Exception as e:
        print(f"Error fetching users: {e}")
        return []

def login_existing_users(count_to_login=20):
    token = get_admin_token()
    if not token:
        return
    users = fetch_randomized_user_pool(token, count_to_login)
    if not users:
        print("No existing test users found to log in.")
        return

    actual_target = len(users)
    print(f"\nProceeding to simulate standard login for {actual_target} users...\n")

    login_url = f"{BASE_URL}/users/auth/login/"
    successful_logins = 0

    for i, user in enumerate(users):
        user_email = user["email"]
        payload = {
            "email": user_email,
            "password": TEST_USER_PASSWORD
        }
        try:
            response = requests.post(login_url, json=payload)
            if response.status_code == 200:
                print(f"[{i+1}/{actual_target}] Login Successful: {user_email} (Now Active)")
                successful_logins += 1
            else:
                print(f"[{i+1}/{actual_target}] Login Failed for {user_email} | Status: {response.status_code}")
        except requests.exceptions.ConnectionError:
            print("Connection interrupted during login loop.")
            break

    print(f"\nFinished processing. Successfully simulated {successful_logins} active user logins.")

if __name__ == "__main__":
    login_existing_users(count_to_login=60)
