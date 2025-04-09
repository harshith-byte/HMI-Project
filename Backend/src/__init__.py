from flask import Flask
app = Flask(__name__)

# Registering blueprints
from .core.routes.views import core_bp

app.register_blueprint(core_bp)