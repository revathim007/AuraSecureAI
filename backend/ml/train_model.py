import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, precision_score, recall_score, f1_score
import joblib
import os

class MLModule:
    def __init__(self, n_samples=4000):
        self.n_samples = n_samples
        self.scaler = StandardScaler()
        self.best_model = None
        self.features_list = []
        self.random_state = 42

    def generate_realistic_data(self):
        """
        Generates synthetic sensor data with pattern-based labeling (not hard thresholds).
        Uses a weighted hazard scoring approach to create 'grey zones'.
        """
        np.random.seed(self.random_state)
        
        # Base sensor readings using normal distributions
        # Broaden distributions to ensure more high-risk samples are generated
        gas_level = np.random.uniform(0, 1000, self.n_samples)
        temperature = np.random.uniform(-50, 150, self.n_samples)
        smoke_level = np.random.uniform(0, 100, self.n_samples)
        pressure = np.random.normal(1013, 20, self.n_samples)
        
        # Ensure realistic ranges
        gas_level = np.clip(gas_level, 0, 1000)
        temperature = np.clip(temperature, -50, 150)
        smoke_level = np.clip(smoke_level, 0, 100)
        pressure = np.clip(pressure, 900, 1100)

        # 1. Weighted Hazard Scoring (Pattern-based)
        # Using a balanced power-based approach (squared) for non-linear risk
        norm_gas = gas_level / 1000
        norm_temp = (temperature + 50) / 200
        norm_smoke = smoke_level / 100
        
        # Risk factors: Individual sensor spikes grow faster than linear, 
        # but don't explode as fast as cubic.
        # Threshold equivalents (approximate risk of 0.25):
        # Gas 250 -> (0.25^2)*1.2 = 0.075
        # Temp 90 -> (0.7^2)*0.8 = 0.29 (High risk)
        # Smoke 15 -> (0.15^2)*0.8 = 0.018
        hazard_score = (np.power(norm_gas, 2.0) * 1.5) + \
                       (np.power(norm_temp, 2.0) * 1.0) + \
                       (np.power(norm_smoke, 2.0) * 1.0)
        
        # Interaction effects: combined moderate values increase risk
        interaction_bonus = (norm_gas * norm_temp * 0.8) + (norm_smoke * norm_temp * 0.6)
        total_risk = hazard_score + interaction_bonus
        
        # 2. Probability Mapping
        # Balanced sigmoid center at 0.35 to ensure clear class separation
        # and prevent "Alarm for everything" behavior.
        prob_alarm = 1 / (1 + np.exp(-12 * (total_risk - 0.35)))
        
        # Generate labels based on probability + some random noise
        labels = (np.random.random(self.n_samples) < prob_alarm).astype(int)

        df = pd.DataFrame({
            'timestamp': pd.date_range(start="2026-01-01", periods=self.n_samples, freq="min"),
            'gas_level': gas_level,
            'temperature': temperature,
            'pressure': pressure,
            'smoke_level': smoke_level,
            'label': labels
        })
        
        # Save dataset for reference
        ml_dir = os.path.dirname(os.path.abspath(__file__))
        df.to_csv(os.path.join(ml_dir, 'safety_monitoring.csv'), index=False)
        print(f"Dataset generated with {self.n_samples} samples and pattern-based labels.")
        return df

    def apply_feature_engineering(self, df, is_training=True):
        """
        Consistent feature engineering for both training and inference.
        """
        df = df.copy()
        
        # Remove timestamp if present (not a feature for this model)
        if 'timestamp' in df.columns:
            df = df.drop('timestamp', axis=1)
            
        # Interaction Features
        df['gas_temp_inter'] = df['gas_level'] * (df['temperature'] + 50) / 1000
        df['smoke_temp_inter'] = df['smoke_level'] * (df['temperature'] + 50) / 100
        df['gas_smoke_inter'] = (df['gas_level'] / 1000) * (df['smoke_level'] / 100)
        
        # Ratios (handle division by zero safely)
        df['gas_temp_ratio'] = df['gas_level'] / (df['temperature'] + 51)
        df['smoke_gas_ratio'] = df['smoke_level'] / (df['gas_level'] + 1)
        
        # Aggregated Risk Index
        df['total_risk_index'] = (df['gas_level']/250 + df['smoke_level']/15 + (df['temperature']+50)/140) / 3
        
        # Final Feature List (Order must be preserved)
        self.features_list = [
            'gas_level', 'temperature', 'pressure', 'smoke_level',
            'gas_temp_inter', 'smoke_temp_inter', 'gas_smoke_inter',
            'gas_temp_ratio', 'smoke_gas_ratio', 'total_risk_index'
        ]
        
        return df[self.features_list + (['label'] if is_training else [])]

    def train_and_evaluate(self):
        # 1. Prepare Data
        raw_df = self.generate_realistic_data()
        processed_df = self.apply_feature_engineering(raw_df)
        
        X = processed_df.drop('label', axis=1)
        y = processed_df['label']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=self.random_state, stratify=y
        )
        
        # 2. Scaling
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # 3. Model Comparison
        print("\n--- Model Evaluation ---")
        
        # Baseline: Logistic Regression
        lr = LogisticRegression(random_state=self.random_state, max_iter=1000)
        lr.fit(X_train_scaled, y_train)
        lr_pred = lr.predict(X_test_scaled)
        print(f"Logistic Regression Accuracy: {accuracy_score(y_test, lr_pred):.4f}")
        
        # Main: Gradient Boosting
        gb = GradientBoostingClassifier(
            n_estimators=150, 
            learning_rate=0.05, 
            max_depth=4, 
            random_state=self.random_state
        )
        gb.fit(X_train_scaled, y_train)
        gb_pred = gb.predict(X_test_scaled)
        gb_acc = accuracy_score(y_test, gb_pred)
        print(f"Gradient Boosting Accuracy: {gb_acc:.4f}")
        
        # 4. Detailed Metrics for Best Model (GB)
        print("\nClassification Report (Gradient Boosting):")
        print(classification_report(y_test, gb_pred))
        
        conf_matrix = confusion_matrix(y_test, gb_pred)
        print(f"Confusion Matrix:\n{conf_matrix}")
        
        self.best_model = gb
        self.save_artifacts()

    def save_artifacts(self):
        ml_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Save model, scaler, and the feature list to ensure consistency
        artifacts = {
            'model': self.best_model,
            'scaler': self.scaler,
            'features': self.features_list
        }
        
        # We save model and scaler separately to keep backend compatibility
        joblib.dump(self.best_model, os.path.join(ml_dir, 'best_model.joblib'))
        joblib.dump(self.scaler, os.path.join(ml_dir, 'scaler.joblib'))
        
        # Extra: save feature order for debugging/verification
        with open(os.path.join(ml_dir, 'feature_metadata.txt'), 'w') as f:
            f.write("\n".join(self.features_list))
            
        print(f"\nArtifacts saved successfully in {ml_dir}")

if __name__ == "__main__":
    module = MLModule(n_samples=4000)
    module.train_and_evaluate()
