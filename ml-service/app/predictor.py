import joblib
import numpy as np
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


class Predictor:
    def __init__(self):
        models_dir = Path(__file__).parent.parent / "models"
        self.classifier = None
        self.anomaly_model = None
        self.anomaly_scaler = None
        self.label_encoder = None
        self.classifier_ready = False
        self.anomaly_detector_ready = False
        self._load_models(models_dir)

    def _load_models(self, models_dir: Path):
        classifier_path = models_dir / "category_classifier.joblib"
        anomaly_path = models_dir / "anomaly_detector.joblib"

        if classifier_path.exists():
            try:
                self.classifier = joblib.load(classifier_path)
                self.classifier_ready = True
                logger.info("Category classifier loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load classifier: {e}")
        else:
            logger.warning("Category classifier not found — run training/train_classifier.py first")

        if anomaly_path.exists():
            try:
                data = joblib.load(anomaly_path)
                self.anomaly_model = data["model"]
                self.anomaly_scaler = data["scaler"]
                self.label_encoder = data["label_encoder"]
                self.anomaly_detector_ready = True
                logger.info("Anomaly detector loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load anomaly detector: {e}")
        else:
            logger.warning("Anomaly detector not found — run training/train_anomaly.py first")

    @property
    def models_loaded(self) -> bool:
        return self.classifier_ready or self.anomaly_detector_ready

    def predict_category(self, merchant: str, description: str) -> tuple[str, float]:
        if not self.classifier_ready:
            return "Uncategorized", 0.0

        text = f"{merchant} {description}".strip().lower()
        try:
            prediction = self.classifier.predict([text])[0]
            probabilities = self.classifier.predict_proba([text])[0]
            confidence = float(max(probabilities))
            return str(prediction), confidence
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return "Uncategorized", 0.0

    def detect_anomaly(self, amount: float, category: str, merchant: str = "") -> tuple[float, bool]:
        if not self.anomaly_detector_ready:
            return 0.0, False

        try:
            # Encode category
            if category in self.label_encoder.classes_:
                cat_encoded = int(self.label_encoder.transform([category])[0])
            else:
                cat_encoded = -1

            features = np.array([[amount, cat_encoded]], dtype=float)
            features_scaled = self.anomaly_scaler.transform(features)

            score = float(self.anomaly_model.decision_function(features_scaled)[0])
            prediction = int(self.anomaly_model.predict(features_scaled)[0])
            is_anomaly = prediction == -1

            return score, is_anomaly
        except Exception as e:
            logger.error(f"Anomaly detection error: {e}")
            return 0.0, False

