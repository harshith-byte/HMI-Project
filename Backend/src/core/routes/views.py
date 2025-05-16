
from flask import Blueprint, request, jsonify
from src.core.scripts.chatWithPDF import get_source_id, get_chatwithpdf

core_bp = Blueprint("core", __name__)

@core_bp.route("/search_response", methods=['POST'])
def search_function():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    domain_type = data.get("domain_type", "").strip().lower()
    query = data.get("query")
    print(f"Received domain_type: {domain_type}")

    domain_map = {
    "gender equality": "data/gender_equality.pdf",
    "labour": "data/labour.pdf",
    "marcoeconomy": "data/marcoeconomy.pdf",
    "health": "data/health.pdf",
    "finance": "data/finance.pdf",
    "subjective wellbeing": "data/subjective_wellbeing.pdf",
    "emission trading": "data/emission_trading.pdf",
    "transport": "data/transport.pdf",
    "refugees & migration": "data/refugees_migration.pdf",
    }

    if domain_type not in domain_map:
        print(f"Invalid domain_type: {domain_type}")
        return jsonify({"error": "Invalid domain"}), 400

    try:
        source_id = get_source_id(domain_map[domain_type])
        answer = get_chatwithpdf(source_id, query)
        return jsonify({"response": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

    pdf_name = indicator_map.get(indicator, "unknown.pdf")

    print(f"PDF selected: {pdf_name}")
    return jsonify({"pdf": pdf_name})




@core_bp.route("/query", methods=['POST', 'OPTIONS'])
def query():
    if request.method == 'OPTIONS':
        return '', 200  # Handles CORS preflight

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    domain_type = data.get("domain_type", "").strip().lower()
    query = data.get("query")
    print(f"Received domain_type: {domain_type}, query: {query}")

    domain_map = {
        "gender equality": "data/gender_equality.pdf",
        "labour": "data/labour.pdf",
        "marcoeconomy": "data/marcoeconomy.pdf",
        "health": "data/health.pdf",
        "finance": "data/finance.pdf",
        "subjective wellbeing": "data/subjective_wellbeing.pdf",
        "emission trading": "data/emission_trading.pdf",
        "transport": "data/transport.pdf",
        "refugees & migration": "data/refugees_migration.pdf",
    }

    if domain_type not in domain_map:
        print(f"Invalid domain_type: {domain_type}")
        return jsonify({"error": "Invalid domain"}), 400

    try:
        source_id = get_source_id(domain_map[domain_type])
        print(f"source_id: {source_id}")
        answer = get_chatwithpdf(source_id, query)
        print(f"Answer: {answer}")
        return jsonify({"response": answer})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
