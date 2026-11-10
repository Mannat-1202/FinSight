from pydantic import BaseModel
from typing import Optional


class CategoryRequest(BaseModel):
    merchant: str
    description: str = ""


class CategoryResponse(BaseModel):
    category: str
    confidence: float


class AnomalyRequest(BaseModel):
    amount: float
    category: str
    merchant: str = ""


class AnomalyResponse(BaseModel):
    anomaly_score: float
    is_anomaly: bool


class HealthResponse(BaseModel):
    status: str
    models_loaded: bool
    classifier_ready: bool
    anomaly_detector_ready: bool

