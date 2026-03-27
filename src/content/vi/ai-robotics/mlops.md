# MLOps

## Tổng quan

MLOps kết hợp Machine Learning và DevOps practices để deploy và maintain ML systems production.

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

## Model Versioning với MLflow

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

## Câu hỏi phỏng vấn

### 1. Data Drift vs Concept Drift?

Data drift: distribution của input features thay đổi. Concept drift: relationship giữa features và target thay đổi. Cả hai cần monitoring và retraining.

### 2. A/B testing cho ML models?

So sánh old model vs new model trên production traffic. Dùng statistical significance để quyết định rollout.

### 3. Feature store là gì?

Centralized repository cho features, đảm bảo consistency giữa training và serving. Ví dụ: Feast, Tecton.
