import csv
import io
import random

import openpyxl
import requests
from faker import Faker

fake = Faker('en_IN')

BASE_URL = "http://localhost:8000/api"
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

def generate_random_csv(file_name):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["transaction_id", "client_name", "email", "amount", "status"])

    for _ in range(random.randint(5, 15)):
        writer.writerow([
            fake.ean8(),
            fake.company(),
            fake.email(),
            random.randint(100, 99999),
            random.choice(['Pending', 'Active', 'Closed'])
        ])

    return {
        "name": file_name,
        "ext": "csv",
        "mime": "text/csv",
        "content": output.getvalue().encode('utf-8')
    }

def generate_random_xlsx(file_name):
    wb = openpyxl.Workbook()
    ws = wb.active
    assert ws is not None
    ws.title = "Data"

    ws.append(["Employee ID", "Name", "Department", "Salary"])
    for _ in range(random.randint(5, 15)):
        ws.append([
            fake.ean8(),
            fake.name(),
            fake.job(),
            random.randint(30000, 150000)
        ])

    stream = io.BytesIO()
    wb.save(stream)

    return {
        "name": file_name,
        "ext": "xlsx",
        "mime": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "content": stream.getvalue()
    }

def mass_upload(total_files=1000):
    token = get_auth_token()
    if not token:
        return

    headers = {"Authorization": f"Bearer {token}"}
    upload_url = f"{BASE_URL}/documents/"

    print(f"Authenticated. Starting mass generation and upload of {total_files} documents.")
    print("This will take a few minutes depending on your hardware. Please wait...\n")

    successful_uploads = 0

    for i in range(1, total_files + 1):
        file_type = random.choice(['csv', 'xlsx'])
        base_name = f"{fake.word().capitalize()}_{fake.word().capitalize()}_Report_{random.randint(1000, 9999)}"

        if file_type == 'csv':
            file_data = generate_random_csv(base_name)
        else:
            file_data = generate_random_xlsx(base_name)

        filename = f"{file_data['name']}.{file_data['ext']}"
        file_buffer = io.BytesIO(file_data['content'])
        file_buffer.name = filename

        multipart_payload = {'file': (filename, file_buffer, file_data['mime'])}
        form_fields = {'name': file_data['name']}

        try:
            response = requests.post(upload_url, headers=headers, data=form_fields, files=multipart_payload)
            if response.status_code in [200, 201]:
                successful_uploads += 1
            else:
                print(f"\nFailed on {filename} | Server Code: {response.status_code}")
        except requests.exceptions.RequestException:
            print(f"\nNetwork request failed for {filename}. Server might be overwhelmed.")
            break

        if i % 50 == 0 or i == total_files:
            print(f"Progress: [{i}/{total_files}] files processed...")

    print(f"\nExecution finished. Successfully uploaded {successful_uploads} out of {total_files} documents.")

if __name__ == "__main__":
    mass_upload(total_files=20)
