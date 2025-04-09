from flask import Blueprint

core_bp = Blueprint("core/routes", __name__)

@core_bp.route("/",methods=['GET'])
def hello_world():
    return "<p>Hello, World!</p>"