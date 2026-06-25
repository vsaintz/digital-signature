import requests

BASE_URL = "http://localhost:8000/api"
SIGNATURE_BASE_URL = "http://localhost:8000/api/signatures"
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "testpassword"

def get_auth_token():
    url = f"{BASE_URL}/users/auth/login/"
    try:
        response = requests.post(url, json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
        if response.status_code == 200:
            return response.json().get("access")
        else:
            print(f"Authentication failed ({response.status_code}): {response.text}")
            return None
    except requests.exceptions.ConnectionError:
        print("Could not connect to the server. Is Django running?")
        return None

def fetch_documents(token, limit=5):
    url = f"{BASE_URL}/documents/"
    headers = {"Authorization": f"Bearer {token}"}

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                results = data
            elif isinstance(data, dict):
                results = data.get("results", [])
            else:
                results = []
            if not results:
                print("No documents found for this user. Upload some first.")
                return []
            doc_ids = [doc.get("id") or doc.get("uuid") for doc in results[:limit]]
            return [doc_id for doc_id in doc_ids if doc_id is not None]
        else:
            print(f"Failed to fetch documents. Status: {response.status_code}")
            return []
    except Exception as e:
        print(f"Error fetching documents: {e}")
        return []

def mass_sign_documents(count=5):
    token = get_auth_token()
    if not token:
        return

    document_ids = fetch_documents(token, limit=count)
    if not document_ids:
        return

    headers = {"Authorization": f"Bearer {token}"}
    print(f"Found {len(document_ids)} documents. Firing signing requests...\n")

    successful_signs = 0

    for i, doc_id in enumerate(document_ids):
        sign_url = f"{SIGNATURE_BASE_URL}/{doc_id}/sign/"
        try:
            response = requests.post(sign_url, headers=headers)
            if response.status_code in [200, 201]:
                print(f"[{i+1}/{len(document_ids)}] Success: Document {doc_id} cryptographically signed.")
                successful_signs += 1
            elif response.status_code == 403:
                print(f"[{i+1}/{len(document_ids)}] Failed: User does not own document {doc_id}.")
            else:
                print(f"[{i+1}/{len(document_ids)}] Failed: {doc_id} | Status: {response.status_code} | {response.text}")
        except requests.exceptions.ConnectionError:
            print("Connection interrupted while attempting to sign.")
            break

    print(f"\nFinished. Successfully signed {successful_signs} out of {len(document_ids)} documents.")

if __name__ == "__main__":
    mass_sign_documents(count=10)
