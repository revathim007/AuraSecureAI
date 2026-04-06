import joblib
import os
import pandas as pd
import numpy as np
from django.conf import settings

class MLPredictor:
    _instance = None
    _model = None
    _scaler = None
    _features_list = [
        'gas_level', 'temperature', 'pressure', 'smoke_level',
        'gas_temp_inter', 'smoke_temp_inter', 'gas_smoke_inter',
        'gas_temp_ratio', 'smoke_gas_ratio', 'total_risk_index'
    ]

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MLPredictor, cls).__new__(cls)
            cls._load_artifacts()
        return cls._instance

    @classmethod
    def _load_artifacts(cls):
        """
        Loads the model and scaler artifacts with robust error handling.
        """
        try:
            # Look for ml folder inside the backend directory
            ml_dir = os.path.join(settings.BASE_DIR, 'ml')
            model_path = os.path.join(ml_dir, 'best_model.joblib')
            scaler_path = os.path.join(ml_dir, 'scaler.joblib')
            
            if not os.path.exists(model_path) or not os.path.exists(scaler_path):
                # We don't raise here during initialization to avoid crashing the whole server
                # instead we'll handle it in the predict method
                print(f"CRITICAL: ML artifacts missing at {ml_dir}. Please run training first.")
                return

            cls._model = joblib.load(model_path)
            cls._scaler = joblib.load(scaler_path)
            print("ML artifacts loaded successfully.")
        except Exception as e:
            print(f"ERROR: Failed to load ML artifacts: {str(e)}")

    def validate_input(self, data):
        """
        Strict validation for sensor inputs.
        """
        required_fields = ['gas_level', 'temperature', 'smoke_level']
        for field in required_fields:
            if field not in data or data[field] is None:
                raise ValueError(f"Missing required field: {field}")
            
            try:
                val = float(data[field])
                data[field] = val # Ensure it's a float
            except (ValueError, TypeError):
                raise ValueError(f"Invalid numeric value for {field}")

        # Check for realistic ranges and negative values
        if data['gas_level'] < 0 or data['gas_level'] > 5000:
            raise ValueError("Gas level must be between 0 and 5000 PPM")
        if data['temperature'] < -100 or data['temperature'] > 500:
            raise ValueError("Temperature must be between -100 and 500 °C")
        if data['smoke_level'] < 0 or data['smoke_level'] > 100:
            raise ValueError("Smoke level must be between 0 and 100 %")

        return data

    def apply_feature_engineering(self, data):
        """
        Identical feature engineering logic as training.
        """
        df = pd.DataFrame([data])
        
        # Add pressure if missing (use standard atmospheric pressure as default)
        if 'pressure' not in df.columns or df['pressure'].iloc[0] is None:
            df['pressure'] = 1013.25
            
        # Interaction Features
        df['gas_temp_inter'] = df['gas_level'] * (df['temperature'] + 50) / 1000
        df['smoke_temp_inter'] = df['smoke_level'] * (df['temperature'] + 50) / 100
        df['gas_smoke_inter'] = (df['gas_level'] / 1000) * (df['smoke_level'] / 100)
        
        # Ratios (handle division by zero safely)
        df['gas_temp_ratio'] = df['gas_level'] / (df['temperature'] + 51)
        df['smoke_gas_ratio'] = df['smoke_level'] / (df['gas_level'] + 1)
        
        # Aggregated Risk Index
        df['total_risk_index'] = (df['gas_level']/250 + df['smoke_level']/15 + (df['temperature']+50)/140) / 3
        
        # Ensure correct column order
        return df[self._features_list]

    def predict(self, input_data):
        """
        Predicts hazard status with probability-based confidence score and safety checks.
        """
        try:
            # 1. Artifact Check
            if self._model is None or self._scaler is None:
                # Attempt to reload once
                self._load_artifacts()
                if self._model is None:
                    return None, None, {"error": "ML model not initialized. Contact admin."}

            # 2. Validation
            validated_data = self.validate_input(input_data)
            
            # 3. Engineering
            df_engineered = self.apply_feature_engineering(validated_data)
            
            # 4. Scaling
            X_scaled = self._scaler.transform(df_engineered)
            
            # 5. Prediction & Probability
            prediction = self._model.predict(X_scaled)[0]
            # Use probability for confidence score
            probabilities = self._model.predict_proba(X_scaled)[0]
            confidence = probabilities[prediction]
            
            # 6. Generate Reason for Alarm
            reason = ""
            if prediction == 1:
                reasons = []
                if validated_data['gas_level'] > 250:
                    reasons.append(f"High Gas Level ({validated_data['gas_level']} PPM)")
                if validated_data['temperature'] > 90:
                    reasons.append(f"High Temperature ({validated_data['temperature']}°C)")
                if validated_data['smoke_level'] > 15:
                    reasons.append(f"High Smoke Level ({validated_data['smoke_level']}%)")
                
                if not reasons:
                    # Case where combination triggered it
                    reasons.append("Dangerous combination of environmental factors detected")
                
                reason = " | ".join(reasons)
            
            # 7. Return compatible format
            res_dict = df_engineered.iloc[0].to_dict()
            res_dict['reason'] = reason
            return int(prediction), float(confidence), res_dict

        except ValueError as ve:
            # Return specific validation errors
            return None, None, {"error": str(ve)}
        except Exception as e:
            # Return generic error for other issues
            return None, None, {"error": "Internal prediction error occurred."}
