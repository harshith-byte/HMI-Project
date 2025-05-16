import requests

CHATWITHPDF_API_KEY = "sec_loUyJX9O4X2dJNHWgyNLjbWIiCr0qAaN"

# In-code source ID mapping
PDF_SOURCE_IDS = {
    "gender equality": "src_xu8lVC3Qox6kchRnG1cq6",
    "labour": "src_gQvco3ftB6bUJ9gQ8u66Y",
    "macroeconomy": "src_YCJY5mElz4tfQiwklzt9g",
    "health": "src_6KqG7PmDuA8DNejTYQyJa",
    "finance": "src_4rs5HOMGVDOErQe10Kafd",
    "subjective wellbeing": "src_y1X9pr5NL2Aer3UI1ydzj",
    "emission trading": "src_ZILm5QI9VzVQUgMRSpE2w",
    "transport": "src_617Hb0pwT8lZQiNi0SaCf",
    "refugees & migration": "src_WR0PhkuLfSAcRq6mjQO3k"
}

def get_source_id(file_path):
    """Uploads the PDF and returns a source ID from ChatPDF."""
    url = "https://api.chatpdf.com/v1/sources/add-file"
    try:
        with open(file_path, 'rb') as f:
            files = [('file', (file_path, f, 'application/octet-stream'))]
            headers = {
                'x-api-key': CHATWITHPDF_API_KEY
            }

            response = requests.post(url, headers=headers, files=files)

        if response.status_code == 200:
            source_id = response.json()['sourceId']
            print(f"✅ Source ID: {source_id}")
            return source_id
        else:
            print(f"❌ Status: {response.status_code}")
            print("❌ Error:", response.text)
            raise Exception("Failed to get source ID from ChatPDF.")
    except FileNotFoundError:
        raise Exception(f"File not found: {file_path}")

def get_chatwithpdf_by_topic(topic, query):
    """Fetches ChatPDF response for a given topic and query."""
    topic_lower = topic.strip().lower()
    source_id = PDF_SOURCE_IDS.get(topic_lower)

    if not source_id:
        raise ValueError(f"No source ID found for topic '{topic}'")

    return get_chatwithpdf(source_id, query)

def get_chatwithpdf(source_id, query):
    """Sends a chat message (query) to ChatPDF using the source ID."""
    url = "https://api.chatpdf.com/v1/chats/message"
    headers = {
        'x-api-key': CHATWITHPDF_API_KEY,
        "Content-Type": "application/json"
    }
    body = {
        'sourceId': source_id,
        'messages': [
            {
                'role': 'user',
                'content': query
            }
        ]
    }

    response = requests.post(url, headers=headers, json=body)

    if response.status_code == 200:
        content = response.json().get('content', '')
        print(f"🗨️ Response: {content}")
        return content
    else:
        print(f"❌ Status: {response.status_code}")
        print("❌ Error:", response.text)
        raise Exception("Failed to chat with PDF.")
