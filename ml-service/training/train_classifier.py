"""
Train the transaction category classifier.
Run from ml-service/ directory:
    python training/train_classifier.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
import joblib
from pathlib import Path
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

DATA_PATH = Path(__file__).parent.parent / "data" / "transactions.csv"
MODEL_PATH = Path(__file__).parent.parent / "models" / "category_classifier.joblib"


def clean_text(text: str) -> str:
    return str(text).lower().strip()


def main():
    print("=== FinSight Category Classifier Training ===\n")

    # Load data
    df = pd.read_csv(DATA_PATH)
    print(f"Loaded {len(df)} rows from {DATA_PATH}")
    print(f"Columns: {list(df.columns)}")
    print(f"\nCategory distribution:\n{df['category'].value_counts()}\n")

    # Drop nulls
    df = df.dropna(subset=["merchant", "category"])
    df["merchant"] = df["merchant"].fillna("")
    df["description"] = df["description"].fillna("")

    # Combine merchant + description as text feature
    df["text"] = (df["merchant"] + " " + df["description"]).apply(clean_text)

    X = df["text"].values
    y = df["category"].values

    # Train/test split (stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Training samples: {len(X_train)} | Test samples: {len(X_test)}\n")

    # Build pipeline: TF-IDF + Logistic Regression
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            sublinear_tf=True,
        )),
        ("clf", LogisticRegression(
            max_iter=1000,
            solver="lbfgs",
            C=1.0,
            random_state=42,
        )),
    ])

    print("Training pipeline...")
    pipeline.fit(X_train, y_train)

    # Evaluate
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Sample predictions
    samples = [
        ("Swiggy", "dinner biryani"),
        ("Uber", "cab ride"),
        ("Netflix", "monthly subscription"),
        ("HDFC Bank", "credit card bill"),
        ("Amazon", "laptop purchase"),
        ("Apollo Pharmacy", "medicine tablets"),
    ]
    print("Sample predictions:")
    for merchant, desc in samples:
        text = clean_text(f"{merchant} {desc}")
        pred = pipeline.predict([text])[0]
        conf = max(pipeline.predict_proba([text])[0])
        print(f"  '{merchant} {desc}' → {pred} (confidence: {conf:.2f})")

    # Save model
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"\nModel saved to {MODEL_PATH}")
    print("Training complete!")


if __name__ == "__main__":
    main()

