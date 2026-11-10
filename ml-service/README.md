# FinSight ML Service

Python-based ML inference service using FastAPI, exposing category prediction and anomaly detection.

## Setup

```bash
cd ml-service
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

## Train Models

```bash
python training/train_classifier.py
python training/train_anomaly.py
```

## Run Service

```bash
uvicorn app.main:app --port 8000 --reload
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Service health + model status |
| POST | /predict-category | Predict transaction category |
| POST | /detect-anomaly | Detect anomalous spending |

## Example Requests

```json
POST /predict-category
{ "merchant": "Swiggy", "description": "dinner order" }
→ { "category": "Food", "confidence": 0.95 }

POST /detect-anomaly
{ "amount": 50000, "category": "Food", "merchant": "Swiggy" }
→ { "anomaly_score": -0.15, "is_anomaly": true }
```

