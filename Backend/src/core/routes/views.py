from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS
import os
import uuid
from gtts import gTTS
import requests
import re

# Create the Flask app
app = Flask(__name__, static_url_path='', static_folder='static')
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

# Create directories for audio files
os.makedirs('static/audio', exist_ok=True)

# Create the core blueprint
core_bp = Blueprint("core", __name__)

# ChatWithPDF API Key
CHATWITHPDF_API_KEY = "sec_loUyJX9O4X2dJNHWgyNLjbWIiCr0qAaN"

# PDF Source IDs mapping
PDF_SOURCE_IDS = {
    "gender equality": "src_xu8lVC3Qox6kchRnG1cq6",
    "labour": "src_gQvco3ftB6bUJ9gQ8u66Y",
    "macroeconomy": "src_YCJY5mElz4tfQiwklzt9g",
    "marcoeconomy": "src_YCJY5mElz4tfQiwklzt9g",
    "health": "src_6KqG7PmDuA8DNejTYQyJa",
    "finance": "src_4rs5HOMGVDOErQe10Kafd",
    "subjective wellbeing": "src_y1X9pr5NL2Aer3UI1ydzj",
    "emission trading": "src_ZILm5QI9VzVQUgMRSpE2w",
    "transport": "src_617Hb0pwT8lZQiNi0SaCf",
    "refugees & migration": "src_WR0PhkuLfSAcRq6mjQO3k"
}

def get_source_id(file_path):
    url = "https://api.chatpdf.com/v1/sources/add-file"
    try:
        with open(file_path, 'rb') as f:
            files = [('file', (file_path, f, 'application/octet-stream'))]
            headers = {'x-api-key': CHATWITHPDF_API_KEY}
            response = requests.post(url, headers=headers, files=files)

        if response.status_code == 200:
            return response.json()['sourceId']
        else:
            raise Exception("Failed to get source ID from ChatPDF.")
    except FileNotFoundError:
        raise Exception(f"File not found: {file_path}")

def get_chatwithpdf_by_topic(topic, query):
    source_id = PDF_SOURCE_IDS.get(topic.strip().lower())
    if not source_id:
        raise ValueError(f"No source ID found for topic '{topic}'")
    return get_chatwithpdf(source_id, query)

def get_chatwithpdf(source_id, query):
    url = "https://api.chatpdf.com/v1/chats/message"
    headers = {
        'x-api-key': CHATWITHPDF_API_KEY,
        "Content-Type": "application/json"
    }
    body = {
        'sourceId': source_id,
        'messages': [{'role': 'user', 'content': query}]
    }
    response = requests.post(url, headers=headers, json=body)

    if response.status_code == 200:
        return response.json().get('content', '')
    else:
        raise Exception("Failed to chat with PDF.")

@core_bp.route("/indicator", methods=["POST"])
def handle_indicator():
    data = request.get_json()
    indicator = data.get("indicator")
    if not indicator:
        return jsonify({"error": "No indicator provided"}), 400

    indicator_map = {
        "gender equality": "gender_equality.pdf",
        "labour": "labour.pdf",
        "marcoeconomy": "marcoeconomy.pdf",
        "health": "health.pdf",
        "finance": "finance.pdf",
        "subjective wellbeing": "subjective_wellbeing.pdf",
        "emission trading": "emission_trading.pdf",
        "transport": "transport.pdf",
        "refugees & migration": "refugees_migration.pdf",
    }
    return jsonify({"pdf": indicator_map.get(indicator, "unknown.pdf")})

@core_bp.route("/search_response", methods=['POST'])
def search_function():
    data = request.get_json()
    domain_type = data.get("domain_type", "").strip().lower()
    query = data.get("query")

    if domain_type not in PDF_SOURCE_IDS:
        return jsonify({"error": "Invalid domain"}), 400

    try:
        answer = get_chatwithpdf(PDF_SOURCE_IDS[domain_type], query)
        return jsonify({"response": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@core_bp.route("/query", methods=['POST', 'OPTIONS'])
def query():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    domain_type = data.get("domain_type", "").strip().lower()
    query = data.get("query")

    if domain_type not in PDF_SOURCE_IDS:
        return jsonify({"error": "Invalid domain"}), 400

    try:
        answer = get_chatwithpdf(PDF_SOURCE_IDS[domain_type], query)
        return jsonify({"response": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@core_bp.route('/summary', methods=['POST'])
def summary():
    domain_type = request.json['domain_type']
    return jsonify({"summary": get_summary(domain_type)})

def get_summary(domain_type):
    prompt = f"Provide a concise summary of the key points about {domain_type} in Germany."
    return get_chatwithpdf_by_topic(domain_type, prompt)

def clean_text(text):
    # Remove bracketed instructions e.g. [Pause for Effect]
    text = re.sub(r"\[.*?\]", "", text)

    # Remove markdown bold **like this**
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)

    # Remove 'Host:' or other speaker tags at the start of lines
    text = re.sub(r"^\s*Host:\s*", "", text, flags=re.MULTILINE)

    # Remove placeholder names like [Your Name]
    text = re.sub(r"\[Your Name\]", "your host", text)

    # Remove any empty lines and extra whitespace
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    cleaned = " ".join(lines)

    return cleaned

@core_bp.route("/generate_podcast", methods=['OPTIONS'])
def generate_podcast_options():
    response = jsonify({'status': 'ok'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

@core_bp.route("/generate_podcast", methods=['POST'])
def generate_podcast():
    data = request.get_json()
    indicator = data.get("indicator", "").strip().lower()

    if not indicator or indicator == "all":
        return jsonify({"error": "Valid indicator required"}), 400

    try:
        prompt = f"""Create a 2-minute podcast script about {indicator} in Germany. \
        Format it as a professional podcast with an introduction, key points, and conclusion.
        Focus on the most important trends, statistics, and their implications.
        Use conversational language suitable for audio narration.
        Include 3-5 specific data points or statistics."""

        summary = get_chatwithpdf_by_topic(indicator, prompt)
        cleaned_summary = clean_text(summary)
        filename = f"{uuid.uuid4().hex}.mp3"
        filepath = os.path.join('static', 'audio', filename)
        tts = gTTS(text=cleaned_summary, lang='en', slow=False)
        tts.save(filepath)

        audio_url = f"http://127.0.0.1:5000/static/audio/{filename}"
        return jsonify({"audio_url": audio_url, "transcript": cleaned_summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Register the blueprint
app.register_blueprint(core_bp, url_prefix="")

if __name__ == "__main__":
    app.run(debug=True)
