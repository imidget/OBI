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
    if not isinstance(message, str):
        message = ""  # защита от запроса, где вместо текста пришло что-то другое
    result = handle_message(message)  # агент решает, что ответить
    return jsonify({"reply": result["reply"], "case_id": result["case_id"]})


if __name__ == "__main__":
    app.run(port=8000, debug=True)
