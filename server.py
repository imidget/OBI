from flask import Flask, request, jsonify, send_from_directory

from agent import handle_message

app = Flask(__name__, static_folder="web", static_url_path="")


@app.route("/")
def index():
    return send_from_directory("web", "index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "")
    reply = handle_message(message)  # всю логику решает агент
    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(port=8000, debug=True)
