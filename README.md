# 🛡️ AuraSecureAI 🤖

### Intelligent ML-Powered Hazard Detection & Safety Monitoring System

AuraSecureAI is a **full-stack, production-ready safety monitoring system** that uses **Machine Learning** to detect hazardous environmental conditions in real time.

It combines a **modern React frontend**, a **scalable Django backend**, and a **SQL Server database**,**deployed on azure**, with **data-driven ML models** to ensure accurate and reliable safety predictions.

---

## 🚀 Key Highlights

✔️ Real-time hazard prediction using ML
✔️ Clean full-stack architecture (React + Django + SQL Server, deployed on Azure)
✔️ Strong validation & error handling (frontend + backend)
✔️ fully ML-driven predictions
✔️ Secure authentication system
✔️ Historical tracking & analytics dashboard

---

## 🔄 End-to-End System Flow

1. **User Registration & Login**

   * Secure authentication with hashed passwords
   * Token-based session handling

2. **Dashboard**

   * Displays:

     * Total scans
     * Safe detections
     * Alarm detections

3. **Hazard Detection**

   * User inputs:

     * Gas Level
     * Temperature
     * Smoke Level

4. **Validation Layer (VERY IMPORTANT)**

   * Frontend:

     * Empty field validation
     * Numeric checks
     * Negative value restriction
   * Backend:

     * Strict validation rules
     * Proper API error responses
     * Data sanitization

5. **ML Prediction Engine**

   * Input is processed using trained ML models
   * System predicts:

     * ✅ Safe
     * 🚨 Alarm

6. **Database Storage**

   * All inputs + predictions stored in SQL Server
   * Enables tracking, auditing, and analysis

7. **History Module**

   * Displays past detections with:

     * Timestamp
     * Sensor values
     * Prediction result

---

## 🧠 Machine Learning Implementation

### ✅ Models Used

* Logistic Regression (baseline model)
* Gradient Boosting Classifier (final optimized model)

### ✅ Key Features

* Fully **data-driven prediction system**
* Handles **borderline values intelligently**
* Uses **feature engineering**:

  * Gas–Temperature ratio
  * Smoke–Gas interaction
* Ensures **consistent preprocessing during training & inference**

### ❌ Important Note

prediction is purely based on ML learning patterns.

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* Lucide Icons

### Backend

* Django
* Django REST Framework
* Python

### Database

* SQL Server (SSMS / Azure SQL compatible)

### ML Stack

* scikit-learn
* Pandas
* NumPy
* Joblib

---

## 📁 Project Structure

```
AuraSecure/
├── backend/          # Django backend (APIs, Models, Logic)
├── frontend/         # React frontend (UI)
├── ml/               # ML training & model files
├── docs/             # Documentation
├── requirements.txt
├── README.md
└── .env.example
```

---

## ⚙️ Setup Instructions

### 🔹 Backend Setup

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 🔹 ML Model Training

```bash
python ml/train_model.py
```

---


---

## 🧩 Features Implemented

* 🔐 Authentication system
* 📊 Dashboard analytics
* ⚠️ Hazard detection module
* 🧠 ML-based prediction system
* 🗃️ Data storage & history tracking
* ✅ Strong validation & exception handling
* 💡 Clean OOPS-based backend structure

---

## 🌟 What Makes This Project Stand Out

* Real-world **safety monitoring use case**
* Strong focus on **ML correctness (not rule-based)**
* Production-level **validation + error handling**
* Scalable **full-stack architecture**
* Handles **edge cases & borderline sensor values**

---

## 👩‍💻 Developed By

**Revathi Meenakshinathan**
MCA | Software Developer | ML Enthusiast

---

## 📌 Future Enhancements

* 📈 Hazard forecasting (time-series prediction)
* 📩 Real-time alerts (Email/SMS integration)
* 📊 Advanced analytics dashboard
* 🌐 Cloud deployment with CI/CD

---

## ⭐ Final Note

AuraSecureAI is designed not just as a project, but as a **real-world intelligent safety system**, combining **software engineering + machine learning + data validation** into one powerful solution.
