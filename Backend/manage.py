from flask import Flask
from flask_cors import CORS
from src.core.routes.views import core_bp

app = Flask(__name__)
CORS(app)

# Register the blueprint
app.register_blueprint(core_bp)

@app.route("/")
def home():
    return "Flask backend is running!"

if __name__ == "__main__":
    app.run(debug=True)
