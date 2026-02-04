import os
from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")

SYSTEM_PROMPT = (
    "You are a logistics optimization assistant for KSA transportation. "
    "Provide concise route guidance and risk factors. "
    "Use bullet points and include ETA considerations for major KSA corridors."
)


def call_openrouter(payload):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    body = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": payload}
        ],
        "temperature": 0.2
    }
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json=body,
        timeout=20
    )
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]


@app.route("/health")
def health():
    return jsonify({"status": "ok", "service": "ksa-logistics-ai"})


@app.route("/")
def root():
    return jsonify({
        "service": "ksa-logistics-ai",
        "health": "/health",
        "predict": "/predict"
    })


@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json() or {}
    origin = payload.get("origin", "")
    destination = payload.get("destination", "")
    vehicle_type = payload.get("vehicleType", "")
    constraints = payload.get("constraints", "")

    prompt = (
        f"Origin: {origin}\nDestination: {destination}\n"
        f"Vehicle type: {vehicle_type}\nConstraints: {constraints}\n"
        "Provide recommended route, risk alerts, and checkpoints."
    )

    if not OPENROUTER_API_KEY:
        return jsonify({
            "recommendation": [
                "Use the primary corridor between origin and destination.",
                "Check for heat-related delays and driver rest compliance.",
                "Schedule checkpoints near major hubs (Riyadh, Jeddah, Dammam)."
            ],
            "note": "OPENROUTER_API_KEY not configured, returning mock output."
        })

    try:
        output = call_openrouter(prompt)
        return jsonify({"recommendation": output})
    except Exception as exc:
        return jsonify({
            "recommendation": [
                "Primary corridor recommended based on origin/destination.",
                "Monitor heat advisories and schedule driver rest stops.",
                "Plan checkpoint handoffs near Riyadh, Jeddah, and Dammam hubs."
            ],
            "note": "AI request failed, returning fallback guidance.",
            "details": str(exc)
        })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
