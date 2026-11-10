FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY app/ ./app/
COPY models/ ./models/
COPY data/ ./data/
COPY training/ ./training/

# Train models if they don't exist
RUN python training/train_classifier.py && python training/train_anomaly.py

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

