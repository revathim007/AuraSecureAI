import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

class MLModule:
    def __init__(self, data_path=None):
        self.scaler = StandardScaler()
        self.model = None
        self.data_path = data_path

    def generate_synthetic_data(self, n_samples=4000):
        np.random.seed(42)
        
        # New data distribution logic as requested
        timestamp = pd.date_range(start="2026-01-01", periods=n_samples, freq="min")
        gas_level = np.random.normal(100, 50, n_samples)
        temperature = np.random.normal(60, 15, n_samples)
        pressure = np.random.normal(200, 40, n_samples)
        smoke_level = np.random.normal(5, 3, n_samples)
        
        # Rule-based labeling with noise:
        # Alarm (1) if Gas > 250 OR Smoke > 15 OR Temperature > 90
        label = ((gas_level > 250) | (smoke_level > 15) | (temperature > 90)).astype(int)
        
        # Adding a lot of noise - flipping labels
        noise_mask = np.random.choice([True, False], size=n_samples, p=[0.15, 0.85]) # Increased noise to 15%
        label[noise_mask] = 1 - label[noise_mask]
        
        df = pd.DataFrame({
            'timestamp': timestamp,
            'gas_level': gas_level,
            'temperature': temperature,
            'pressure': pressure,
            'smoke_level': smoke_level,
            'label': label
        })
        
        # Save to CSV
        ml_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(ml_dir, 'safety_monitoring.csv')
        df.to_csv(csv_path, index=False)
        print(f"Generated {n_samples} rows with timestamp and pressure, saved to {csv_path}")
        
        return df

    def feature_engineering(self, df):
        df = df.copy()
        # Ensure we don't use timestamp for training directly
        if 'timestamp' in df.columns:
            df = df.drop('timestamp', axis=1)
            
        # Feature engineering logic (keeping it consistent with original but adding pressure)
        df['gas_temp_ratio'] = df['gas_level'] / (df['temperature'] + 51)
        df['smoke_gas_ratio'] = df['smoke_level'] / (df['gas_level'] + 1)
        df['temp_smoke_interaction'] = df['temperature'] * df['smoke_level']
        df['combined_risk_score'] = (df['gas_level'] / 10 + (df['temperature'] + 50) + df['smoke_level']) / 3
        df['pressure_temp_ratio'] = df['pressure'] / (df['temperature'] + 51)
        return df

    def train(self):
        df = self.generate_synthetic_data()
        df = self.feature_engineering(df)
        
        X = df.drop('label', axis=1)
        print("Training with features:", X.columns.tolist())
        y = df['label']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scaling
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Logistic Regression (Baseline)
        lr = LogisticRegression()
        lr.fit(X_train_scaled, y_train)
        lr_pred = lr.predict(X_test_scaled)
        print("Logistic Regression Accuracy:", accuracy_score(y_test, lr_pred))
        
        # Gradient Boosting (Final)
        gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
        gb.fit(X_train_scaled, y_train)
        gb_pred = gb.predict(X_test_scaled)
        print("Gradient Boosting Accuracy:", accuracy_score(y_test, gb_pred))
        print(classification_report(y_test, gb_pred))
        
        self.model = gb
        self.save_artifacts()

    def save_artifacts(self):
        ml_dir = os.path.dirname(os.path.abspath(__file__))
        joblib.dump(self.model, os.path.join(ml_dir, 'best_model.joblib'))
        joblib.dump(self.scaler, os.path.join(ml_dir, 'scaler.joblib'))
        print(f"Artifacts saved in {ml_dir}")

if __name__ == "__main__":
    ml = MLModule()
    ml.train()
