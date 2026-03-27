# MLOps

## Overview

MLOps combines Machine Learning and DevOps practices to deploy and maintain ML systems in production.

## ML Pipeline

```python
# Prefect pipeline
from prefect import flow, task

@task
def load_data():
    return pd.read_csv("data.csv")

@task
def preprocess(df):
    return df.dropna()

@task
def train(df):
    model = RandomForestClassifier()
    model.fit(df.drop("target", axis=1), df["target"])
    return model

@flow
def ml_pipeline():
    data = load_data()
    clean_data = preprocess(data)
    model = train(clean_data)
    return model
```

## Model Versioning with MLflow

```python
import mlflow
from mlflow.tracking import MlflowClient

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("production-models")

with mlflow.start_run():
    # Log parameters
    mlflow.log_param("n_estimators", 100)
    mlflow.log_param("max_depth", 10)

    # Train
    model.fit(X_train, y_train)

    # Log metrics
    mlflow.log_metric("accuracy", accuracy)

    # Log model
    mlflow.sklearn.log_model(model, "model")
```

## Model Serving

```python
# FastAPI serving
from fastapi import FastAPI
import joblib

app = FastAPI()
model = joblib.load("model.pkl")

@app.post("/predict")
def predict(request: PredictionRequest):
    data = request.to_df()
    prediction = model.predict(data)
    probability = model.predict_proba(data)
    return {
        "prediction": prediction.tolist(),
        "confidence": probability.tolist()
    }
```

## Monitoring

```python
# Evidently AI
from evidently.dashboard import Dashboard
from evidently.tabs import DataDriftTab

column_mapping = ColumnMapping()
column_mapping.target = "target"
column_mapping.prediction = "prediction"

dashboard = Dashboard(tabs=[DataDriftTab()])
dashboard.calculate(reference_data, current_data,
                   column_mapping=column_mapping)
dashboard.save("drift_report.html")
```

## Interview Questions

### 1. Data Drift vs Concept Drift?

Data drift: the distribution of input features changes. Concept drift: the relationship between features and target changes. Both require monitoring and retraining.

### 2. A/B testing for ML models?

Compare old model vs new model on production traffic. Use statistical significance to decide on rollout.

### 3. What is a Feature Store?

A centralized repository for features, ensuring consistency between training and serving. Examples: Feast, Tecton.
