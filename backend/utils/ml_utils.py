import joblib
import os
import pandas as pd
from django.conf import settings

class MLPredictor:
    _instance = None
    _model = None
    _scaler = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MLPredictor, cls).__new__(cls)
            cls._load_artifacts()
        return cls._instance

    @classmethod
    def _load_artifacts(cls):
        # Look for ml folder in the project root (one level up from backend)
        root_dir = settings.BASE_DIR.parent
        ml_dir = os.path.join(root_dir, 'ml')
        model_path = os.path.join(ml_dir, 'best_model.joblib')
        scaler_path = os.path.join(ml_dir, 'scaler.joblib')
        
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            cls._model = joblib.load(model_path)
            cls._scaler = joblib.load(scaler_path)
        else:
            raise FileNotFoundError("ML artifacts not found. Please run the training script first.")

    def feature_engineering(self, data):
        # input data should be a dict with gas_level, temperature, smoke_level
        df = pd.DataFrame([data])
        df['gas_temp_ratio'] = df['gas_level'] / (df['temperature'] + 1)
        df['smoke_gas_ratio'] = df['smoke_level'] / (df['gas_level'] + 1)
        df['temp_smoke_interaction'] = df['temperature'] * df['smoke_level']
        df['combined_risk_score'] = (df['gas_level'] + df['temperature'] + df['smoke_level']) / 3
        return df

    def predict(self, input_data):
        df_engineered = self.feature_engineering(input_data)
        
        # Scaling
        X_scaled = self._scaler.transform(df_engineered)
        
        # Prediction
        prediction = self._model.predict(X_scaled)[0]
        confidence = self._model.predict_proba(X_scaled)[0].max()
        
        return int(prediction), float(confidence), df_engineered.iloc[0].to_dict()
