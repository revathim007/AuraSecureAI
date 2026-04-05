# AuraSecureAI 🛡️🤖

**Next-Generation ML-Powered Hazard Prediction & Safety Monitoring System**

AuraSecureAI is a full-stack solution designed for high-precision environmental hazard detection. It integrates a modern React frontend with a robust Django backend, backed by SQL Server, and uses advanced Machine Learning models (Gradient Boosting & Logistic Regression) for real-time safety analysis.

---

## 🚀 **Full Project Flow**
1.  **Register**: User creates an account with secure, hashed password handling.
2.  **Login**: Authenticated access with token-based security.
3.  **Dashboard**: Overview of safety statistics (Total Scans, Alarms, Safe detections).
4.  **Hazard Detection**: Input environmental data (Gas, Temp, Smoke).
5.  **Prediction**: Backend AI analyzes inputs and determines if the environment is "Safe" or an "Alarm" state.
6.  **Store**: All detections are saved in the SQL Server database for history and auditing.
7.  **History**: Comprehensive view of all past system evaluations with timestamps and sensor readings.

---

## 🛠️ **Tech Stack**
-   **Frontend**: React 19, Vite, Tailwind CSS, Axios, Lucide-React.
-   **Backend**: Python, Django, Django REST Framework, SQL Server (SSMS).
-   **Database**: SQL Server (AuraSecureAI_RevathiDB).
-   **ML Stack**: scikit-learn, Pandas, NumPy, Joblib (Gradient Boosting & Logistic Regression).

---

## 📁 **Folder Structure**
```
AuraSecure/
├── backend/          # Django project files (Models, Serializers, Views)
├── frontend/         # React application (Vite-based)
├── ml/               # ML training scripts and saved artifacts
├── docs/             # Project documentation and reports
├── requirements.txt  # Python dependencies
├── README.md         # Main project documentation
└── .env.example      # Template for environment variables
```

---

## 🧠 **Machine Learning Integration**
-   **Baseline**: Logistic Regression for explainable hazard prediction.
-   **Final Model**: Gradient Boosting Classifier for high-performance and robust safety status determination.
-   **Feature Engineering**: Custom engineering (gas-temp ratio, smoke-gas ratio, etc.) is applied consistently during training and inference.
-   **No Hardcoded Logic**: All predictions are 100% driven by the ML model, ensuring data-driven safety assessments.

---

## 🛠️ **Setup & Installation**

### 1. **Backend Setup**
1.  Navigate to `backend/`.
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    .\venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r ../requirements.txt
    ```
4.  Configure your database in `core/settings.py` or `.env`.
5.  Run migrations:
    ```bash
    python manage.py migrate
    ```
6.  Start server:
    ```bash
    python manage.py runserver
    ```

### 2. **Frontend Setup**
1.  Navigate to `frontend/`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start dev server:
    ```bash
    npm run dev
    ```

### 3. **ML Training**
To retrain the model:
```bash
python ml/train_model.py
```

---

## 🧪 **Verification**
-   **APIs**: Verified using DRF browsable API and frontend integration.
-   **ML**: Models evaluated with accuracy and classification reports.
-   **Database**: Connectivity and storage verified with SQL Server.

Developed by Revathi - AuraSecureAI
