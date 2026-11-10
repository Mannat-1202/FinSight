import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import CategoryRequest, CategoryResponse, AnomalyRequest, AnomalyResponse, HealthResponse
from app.predictor import Predictor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FinSight ML Service",
    description="Category classifier and anomaly detection for FinSight",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = Predictor()


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="healthy",
        models_loaded=predictor.models_loaded,
        classifier_ready=predictor.classifier_ready,
        anomaly_detector_ready=predictor.anomaly_detector_ready,
    )


@app.post("/predict-category", response_model=CategoryResponse)
async def predict_category(request: CategoryRequest):
    category, confidence = predictor.predict_category(request.merchant, request.description)
    return CategoryResponse(category=category, confidence=confidence)


@app.post("/detect-anomaly", response_model=AnomalyResponse)
async def detect_anomaly(request: AnomalyRequest):
    score, is_anomaly = predictor.detect_anomaly(request.amount, request.category, request.merchant)
    return AnomalyResponse(anomaly_score=score, is_anomaly=is_anomaly)

