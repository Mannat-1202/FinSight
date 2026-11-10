# FinSight — AI-Powered Personal Finance & Expense Intelligence Platform

FinSight turns raw personal transactions into categorized expenses, budget tracking, unusual-spending alerts, visual analytics, and intelligent financial insights.

## Architecture

```
USER
  │
  ▼
Next.js Frontend (Port 3000)
  │ REST/JSON
  ▼
Java Spring Boot Backend (Port 8080)
  ├──── MySQL (users, transactions, budgets)
  └──── Python FastAPI ML Service (Port 8000)
              ├──── Category Classifier (TF-IDF + Logistic Regression)
              └──── Anomaly Detector (Isolation Forest)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js + React + TypeScript + Tailwind CSS + Recharts |
| Backend | Java + Spring Boot + Spring Security + JWT |
| Database | MySQL |
| ML Service | Python + FastAPI + Scikit-learn |
| ML Models | TF-IDF + Logistic Regression (classifier), Isolation Forest (anomaly) |

## Project Structure

```
finsight/
  backend/          # Java Spring Boot REST API
  frontend/         # Next.js + TypeScript dashboard
  ml-service/       # Python ML + FastAPI inference service
  docs/             # Documentation
```

## Quick Start

### Prerequisites
- JDK 21+
- Node.js 18+ & npm
- Python 3.10+
- MySQL Server

### 1. Database Setup
```sql
CREATE DATABASE finsight_db;
```

### 2. ML Service
```bash
cd ml-service
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/Mac: source .venv/bin/activate
pip install -r requirements.txt
python training/train_classifier.py
python training/train_anomaly.py
uvicorn app.main:app --port 8000
```

### 3. Backend
```bash
cd backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## API Endpoints

| Area | Endpoints |
|------|-----------|
| Auth | POST /api/auth/register, POST /api/auth/login |
| Transactions | CRUD at /api/transactions |
| Dashboard | GET /api/dashboard/summary |
| Analytics | GET /api/analytics/categories, /monthly, /comparison |
| Budgets | CRUD at /api/budgets, GET /api/budgets/status |
| Import | POST /api/transactions/import |

## Features
- 🔐 Secure JWT authentication with BCrypt password hashing
- 💳 Full transaction CRUD with validation
- 🤖 ML-powered automatic transaction categorization
- 🚨 Anomaly detection for unusual spending
- 📊 Interactive dashboard with charts and analytics
- 💰 Budget management with progress tracking
- 📈 Month-over-month spending comparison
- 📁 CSV bulk transaction import

## License
MIT

