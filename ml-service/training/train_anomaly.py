"""
Train the anomaly detection model.
Run from ml-service/ directory:
    python training/train_anomaly.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder, StandardScaler

DATA_PATH = Path(__file__).parent.parent / "data" / "transactions.csv"
MODEL_PATH = Path(__file__).parent.parent / "models" / "anomaly_detector.joblib"


def main():
    print("=== FinSight Anomaly Detector Training ===\n")

    df = pd.read_csv(DATA_PATH)
    print(f"Loaded {len(df)} rows")

    df = df.dropna(subset=["amount", "category"])
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df = df.dropna(subset=["amount"])

    # Encode category
    le = LabelEncoder()
    df["category_encoded"] = le.fit_transform(df["category"])
    print(f"Categories: {list(le.classes_)}")

    # Features: amount + category_encoded
    X = df[["amount", "category_encoded"]].values.astype(float)

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Isolation Forest
    model = IsolationForest(
        contamination=0.05,
        random_state=42,
        n_estimators=100,
    )
    model.fit(X_scaled)

    # Report
    predictions = model.predict(X_scaled)
    n_anomalies = (predictions == -1).sum()
    print(f"\nFlagged {n_anomalies}/{len(df)} transactions as anomalous ({n_anomalies/len(df)*100:.1f}%)")

    scores = model.decision_function(X_scaled)
    threshold_idx = np.argsort(scores)[:5]
    print("\nTop 5 most anomalous transactions:")
    for idx in threshold_idx:
        row = df.iloc[idx]
        print(f"  {row.get('merchant', 'N/A'):20s} | ₹{row['amount']:>8.2f} | {row['category']:15s} | score={scores[idx]:.4f}")

    # Save model bundle
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({
        "model": model,
        "scaler": scaler,
        "label_encoder": le,
    }, MODEL_PATH)
    print(f"\nModel saved to {MODEL_PATH}")
    print("Training complete!")


if __name__ == "__main__":
    main()

