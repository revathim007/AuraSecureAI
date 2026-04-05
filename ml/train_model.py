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

    def generate_synthetic_data(self, n_samples=1000):
        np.random.seed(42)
        gas_level = np.random.uniform(0, 100, n_samples)
        temperature = np.random.uniform(20, 80, n_samples)
        smoke_level = np.random.uniform(0, 100, n_samples)
        
        # Base logic for label (with some noise)
        # Hazard if gas_level > 70 or temperature > 60 or smoke_level > 60
        risk_score = (gas_level * 0.4 + temperature * 0.3 + smoke_level * 0.3)
        noise = np.random.normal(0, 5, n_samples)
        risk_score += noise
        
        label = (risk_score > 60).astype(int)
        
        df = pd.DataFrame({
            'gas_level': gas_level,
            'temperature': temperature,
            'smoke_level': smoke_level,
            'label': label
        })
        return df

    def feature_engineering(self, df):
        df = df.copy()
        # Avoid division by zero
        df['gas_temp_ratio'] = df['gas_level'] / (df['temperature'] + 1)
        df['smoke_gas_ratio'] = df['smoke_level'] / (df['gas_level'] + 1)
        df['temp_smoke_interaction'] = df['temperature'] * df['smoke_level']
        df['combined_risk_score'] = (df['gas_level'] + df['temperature'] + df['smoke_level']) / 3
        return df

    def train(self):
        df = self.generate_synthetic_data()
        df = self.feature_engineering(df)
        
        X = df.drop('label', axis=1)
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
