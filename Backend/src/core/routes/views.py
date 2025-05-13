from flask import Blueprint, request

from Backend.src.core.scripts.chatWithPDF import get_source_id, get_chatwithpdf

core_bp = Blueprint("core/routes", __name__)
domain_type=""
@core_bp.route("/",methods=['GET'])
def hello_world():
    return "<p>Hello, World!</p>"

@core_bp.route("/search",methods=['GET'])
def get_search_data():
    domain_type = request.args.get("data")

@core_bp.route("/search_response",methods=['POST'])
def search_function(query):

    domain_map={
        "gender equality":"Backend/data/gender_equality.pdf",
        "labour":"Backend/data/labour.pdf",
        "marcoeconomy":"Backend/data/marcoeconomy.pdf",
        "health":"Backend/data/health.pdf",
        "finance":"Backend/data/finance.pdf",
        "subjective wellbeing": "Backend/data/subjective_wellbeing.pdf",
        "emission trading": "Backend/data/emission_trading.pdf",
        "transport": "Backend/data/transport.pdf",
        "refugees & migration": "Backend/data/refugees_migration.pdf",
    }

    source_id = get_source_id(domain_map[domain_type])
    get_chatwithpdf(source_id,query)