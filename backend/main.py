import os
import io
from google.cloud import storage
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import FormRecognizerClient
import firebase_admin
from firebase_admin import credentials, firestore
import openai
import json
from datetime import datetime, timedelta, timezone



openai.api_key = 'XXX-XXX-XXX-XXX'
path_to_service_account = 'XXX-XXX-XXX-XXX'
bucket_name = 'XXX-XXX-XXX-XXX'
api_key = "XXX-XXX-XXX-XXX"
endpoint = "XXX-XXX-XXX-XXX"

 
firebase_admin.initialize_app(credentials.Certificate(path_to_service_account))

db = firestore.client()
bills_ref = db.collection('bills')


def fetch_latest_image_from_firebase(user_uid):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = path_to_service_account
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)
    user_blobs = list(bucket.list_blobs(prefix=f"users/{user_uid}/photos/"))
    user_blobs.sort(key=lambda x: x.time_created, reverse=True)

    if not user_blobs:
        print("No images found for the user.")
        return None

    latest_blob = user_blobs[0]
    image_data = latest_blob.download_as_bytes()

    return image_data


def analyze_receipt(receipt_data, api_key, endpoint):
    client = FormRecognizerClient(endpoint, AzureKeyCredential(api_key))
    
    stream = io.BytesIO(receipt_data)
    poller = client.begin_recognize_receipts(stream, content_type="image/jpeg")
    result = poller.result()

    items_data = {"unclaimed": {}}  
    merchant_data = {"value": "None", "confidence": 0}
    date_data = {"value": "None", "confidence": 0}

    for receipt in result:
        for name, field in receipt.fields.items():
            if name == "Items":
                for idx, items in enumerate(field.value):
                    unique_id = f"item_{idx + 1}"   # Creating a unique item id
                    item_name = items.value["Name"].value if items.value.get("Name") else "None"
                    item_name_confidence = items.value["Name"].confidence if items.value.get("Name") else 0

                    item_price = items.value["TotalPrice"].value if items.value.get("TotalPrice") else "None"
                    item_price_confidence = items.value["TotalPrice"].confidence if items.value.get("TotalPrice") else 0

                    item_quantity = items.value["Quantity"].value if items.value.get("Quantity") else "None"
                    item_quantity_confidence = items.value["Quantity"].confidence if items.value.get("Quantity") else 0

                    item_data = {
                        "name": {"value": item_name, "confidence": item_name_confidence},
                        "price": {"value": item_price, "confidence": item_price_confidence},
                        "quantity": {"value": item_quantity, "confidence": item_quantity_confidence}
                    }
                    items_data["unclaimed"][unique_id] = item_data  
            elif name == "MerchantName":
                merchant_data = {
                    "value": field.value if field.value else "None",
                    "confidence": field.confidence
                }
            elif name == "TransactionDate":
                date_value = field.value.strftime('%m-%d-%y') if field.value else "None"
                date_data = {
                    "value": date_value,
                    "confidence": field.confidence
                }

    tax = {
        "value": receipt.fields["Tax"].value if receipt.fields.get("Tax") and receipt.fields["Tax"].value else "None",
        "confidence": receipt.fields["Tax"].confidence if receipt.fields.get("Tax") else 0
    }
    gratuity = {
        "value": receipt.fields["Tip"].value if receipt.fields.get("Tip") and receipt.fields["Tip"].value else "None",
        "confidence": receipt.fields["Tip"].confidence if receipt.fields.get("Tip") else 0
    }
    total = {
        "value": receipt.fields["Total"].value if receipt.fields.get("Total") and receipt.fields["Total"].value else "None",
        "confidence": receipt.fields["Total"].confidence if receipt.fields.get("Total") else 0
    }

    summary_data = {
        "tax": tax,
        "gratuity": gratuity,
        "total": total,
        "merchant": merchant_data,
        "date": date_data
    }

    return {"items": items_data, "summary": summary_data, "users": []} 




def extract_raw_text(receipt_data, api_key, endpoint):
    client = FormRecognizerClient(endpoint, AzureKeyCredential(api_key))
    poller = client.begin_recognize_content(io.BytesIO(receipt_data))
    result = poller.result()

    raw_text_data = ""
    for page in result:
        for line in page.lines:
            raw_text_data += line.text + "\n"
    
    return raw_text_data

def refine_data_with_gpt4(raw_text, extracted_data, owner):
    DESIRED_FORMAT = """
    {
      "items": {
        "unclaimed": {
          "id": {
            "name": "(String)",
            "price": (float (0.00)),
            "quantity": (int)
          }
          #... more items
        },
      },

      "summary": {
        "tax": (float (0.00)),
        "gratuity": (float (0.00)),
        "total": (float (0.00)),
        "date": "(String (MM/DD/YY))",
        "merchant": "(String)"
        "timeCreated": "(String)" 
      },
      "users": [
        "(userUID)",
        #... other UIDs
      ]
    }"""

    instructions = f"""
    - Here's the raw receipt OCR text data: {raw_text}
    - Here's the extracted text in JSON format: {extracted_data}
    - Generate a strict JSON structure that matches this format: {DESIRED_FORMAT}
    - Correct inconsistencies and fill in any missing data.
    - Each field will come with a confidence level, if the level is low try to find the error and overwrite it.
    - Merchant name can be a restaraunt name, supermarket name, etc.
    - You must rename item names to be more readable as much as possible, no special characters, and follow proper capitalization.
    - Retain order of items provided from the extracted text.
    - If you are unable to find a numerical value for "None" fields even after sorting through the raw data, set it to 0 instead of "none". **For quantity by default set numerical value to 1 if not found**
    - Each item should have a unique ID random 7 digit number, it must be 7 no more no less.
    - The items should be nested under 'unclaimed'.
    - The first userID in the users array should be: {owner}
    - For the timeCreated field use this string {datetime.now(timezone.utc).astimezone(timezone(timedelta(hours=-4))).isoformat()}
    - Return only the plain JSON without any additional text or explanations.
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4", 
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant. Please follow the instructions provided to refine the data."
            },
            {
                "role": "user",
                "content": instructions
            }
        ]
    )

    refined_data = response['choices'][0]['message']['content']
    refined_data_json = json.loads(refined_data)
    

    return refined_data_json

def process_uploaded_image(event, context):
    file_data = event
    

    file_path = file_data['name']
    user_uid = file_path.split("/")[1]

    user_ref = firestore.client().collection('users').document(user_uid)


    new_bill_ref = bills_ref.document()
    bill_id = new_bill_ref.id

    user_ref.update({
        'bills': firestore.ArrayUnion([bill_id]),
    })

    print("Bill ID: ", bill_id)

    image_data = fetch_latest_image_from_firebase(user_uid)

    if image_data:
        image_size_mb = len(image_data) / (1024 * 1024)
        print(f"Image size: {image_size_mb:.2f} MB")

        extracted_data = analyze_receipt(image_data, api_key, endpoint)
        raw_text = extract_raw_text(image_data, api_key, endpoint)
        refined_data =  refine_data_with_gpt4(raw_text, extracted_data, user_uid)

        print("Extracted Data:", extracted_data)

        new_bill_ref.set(refined_data)
        
    user_ref.update({'uploaded': True})
    
    return 'Receipt processing completed!', 200

