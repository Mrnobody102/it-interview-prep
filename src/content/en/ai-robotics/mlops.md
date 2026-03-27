# MLOps

## Overview

MLOps (Machine Learning Operations) applies DevOps principles to the machine learning lifecycle. It addresses the unique challenges of ML systems: data dependency management, model reproducibility, continuous training, monitoring for model degradation, and the gap between data science experimentation and production reliability.

The core principle: treat ML models like software artifacts, with version control, testing, CI/CD, and monitoring.

## ML Pipeline Stages

A production ML pipeline consists of interconnected stages:

```
Data Collection -> Data Validation -> Data Preprocessing ->
Feature Engineering -> Model Training -> Model Evaluation ->
Model Validation -> Model Serving -> Monitoring
```

Each stage should be:

- **Reproducible:** same inputs always produce same outputs
- **Versioned:** data, code, config, and model versions are tracked
- **Testable:** data schema checks, model performance gates
- **Automated:** triggered by events or schedules, not manual runs

---

## Data Management

## Data Versioning

Data changes over time (data drift, schema evolution). Versioning datasets enables:

- Reproducing model training with specific data versions
- A/B testing models trained on different data
- Rollback to previous data states

Tools: DVC (Data Version Control), LakeFS, Delta Lake

```python
# DVC pipeline example (dvc.yaml)
# dvc.yaml
stages:
  preprocess:
    cmd: python src/preprocess.py
    deps:
      - data/raw.csv
    params:
      - preprocess.test_size
    outs:
      - data/processed/

  train:
    cmd: python src/train.py
    deps:
      - data/processed/
      - src/train.py
    params:
      - train.lr
      - train.epochs
    outs:
      - models/checkpoint.pt
```

## Data Validation

Automated checks before training:

```python
import great_expectations as gx

context = gx.get_context()
suite = context.suites.create(name="training_data_suite")

# Expect column to exist and match type
suite.add_expectation(
    gx.expectations.ExpectColumnToExist("user_id")
)
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToNotBeNull("timestamp")
)
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeInRange("age", min_value=0, max_value=120)
)

# Validate new batch
batch = context.sources.pandas_filesystem.read_dataset(path="data/batch.csv")
results = suite.validate(batch)
if not results.success:
    raise ValueError(f"Data validation failed: {results}")
```

---

## Experiment Tracking

## MLflow

MLflow is the most widely used open-source experiment tracking platform.

```python
import mlflow
import mlflow.sklearn
from mlflow.models.signature import infer_signature

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("customer-churn-prediction")

with mlflow.start_run(run_name="random-forest-baseline"):
    # Log parameters
    mlflow.log_param("model_type", "RandomForest")
    mlflow.log_param("n_estimators", 200)
    mlflow.log_param("max_depth", 12)
    mlflow.log_param("class_weight", "balanced")

    # Train model
    model = RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    # Log metrics
    mlflow.log_metric("accuracy", accuracy_score(y_test, y_pred))
    mlflow.log_metric("precision", precision_score(y_test, y_pred))
    mlflow.log_metric("recall", recall_score(y_test, y_pred))
    mlflow.log_metric("f1", f1_score(y_test, y_pred))
    mlflow.log_metric("auc_roc", roc_auc_score(y_test, y_prob))

    # Log feature importance
    import pandas as pd
    importance_df = pd.DataFrame({
        "feature": feature_names,
        "importance": model.feature_importances_
    }).sort_values("importance", ascending=False)
    importance_df.to_csv("feature_importance.csv", index=False)
    mlflow.log_artifact("feature_importance.csv")

    # Log model with signature
    signature = infer_signature(X_train, y_prob)
    mlflow.sklearn.log_model(
        sk_model=model,
        artifact_path="model",
        signature=signature,
        registered_model_name="customer-churn-rf",
    )

    # Log dataset info
    mlflow.log_input(
        mlflow.data.load_pandas(df=X_train),
        context="training",
    )

print(f"MLflow run: {mlflow.active_run().info.run_id}")
```

## Weights & Biases (W&B)

```python
import wandb

wandb.init(project="customer-churn", name="xgb-optimization")
wandb.config.update({
    "model": "XGBoost",
    "n_estimators": 300,
    "max_depth": 8,
    "learning_rate": 0.05,
    "subsample": 0.8,
})

# Training loop
for epoch in range(n_epochs):
    train_loss = train_epoch(model, train_loader)
    val_metrics = evaluate(model, val_loader)

    wandb.log({
        "epoch": epoch,
        "train_loss": train_loss,
        "val_accuracy": val_metrics["accuracy"],
        "val_f1": val_metrics["f1"],
        "val_auc": val_metrics["auc_roc"],
    })

# Log artifacts
wandb.log_artifact("models/checkpoint.pt", name="best-model", type="model")
wandb.finish()
```

## TensorBoard

```python
from torch.utils.tensorboard import SummaryWriter

writer = SummaryWriter(log_dir="runs/experiment-1")

for epoch in range(n_epochs):
    model.train()
    for batch in train_loader:
        optimizer.zero_grad()
        loss = compute_loss(model, batch)
        loss.backward()
        optimizer.step()

    # Log scalar
    writer.add_scalar("Loss/train", train_loss, epoch)
    writer.add_scalar("Loss/val", val_loss, epoch)

    # Log histograms (gradients, weights)
    for name, param in model.named_parameters():
        writer.add_histogram(f"grads/{name}", param.grad, epoch)
        writer.add_histogram(f"weights/{name}", param, epoch)

    # Log learning rate
    writer.add_scalar("lr", optimizer.param_groups[0]["lr"], epoch)

writer.close()
```

---

## Model Versioning and Registry

A model registry centralizes model versioning, metadata, and promotion across stages.

## MLflow Model Registry

```python
from mlflow.tracking import MlflowClient

client = MlflowClient()

# Register a new model version
model_uri = "runs:/<run_id>/model"
registered_model = mlflow.register_model(model_uri, "customer-churn-rf")
print(f"Registered model version: {registered_model.version}")

# Transition model through stages
client.transition_model_version_stage(
    name="customer-churn-rf",
    version=1,
    stage="Staging",
)

# Promote to Production
client.transition_model_version_stage(
    name="customer-churn-rf",
    version=1,
    stage="Production",
)

# Load from registry for serving
import mlflow.pyfunc
production_model = mlflow.pyfunc.load_model(
    model_uri="models:/customer-churn-rf/Production"
)
```

## Alternative: Model versioning with DVC + Git

```bash
# Tag model with git and dvc
dvc commit
git add models/checkpoint.pt.dvc
git commit -m "Add model checkpoint v2.1"
git tag -a "model-v2.1" -m "XGBoost model, F1=0.87"

# Reproduce old model
git checkout model-v2.1
dvc checkout
```

---

## Feature Store

A feature store provides:

- **Offline storage:** for training (parquet files, data lake)
- **Online storage:** for real-time serving (Redis, DynamoDB)
- **Consistency:** same feature computation for training and serving

## Feast (Open Source Feature Store)

```python
from feast import FeatureStore
import pandas as pd

# feature_store.yaml defines data sources and feature views
store = FeatureStore("./feature_repo")

# 1. Define feature view
feature_view = FeatureView(
    name="user_features",
    entities=["user_id"],
    ttl=timedelta(days=1),
    schema=[
        Field(name="total_spend", dtype=Float64),
        Field(name="num_purchases", dtype=Int64),
        Field(name="avg_rating", dtype=Float64),
    ],
)

# 2. Get training features (offline)
training_df = store.get_historical_features(
    entity_df=entity_df,
    feature_refs=[
        "user_features:total_spend",
        "user_features:num_purchases",
        "user_features:avg_rating",
    ],
).to_df()

# 3. Get online features (for serving)
feature_vector = store.get_online_features(
    entity_rows=[{"user_id": 12345}],
    feature_refs=[
        "user_features:total_spend",
        "user_features:num_purchases",
    ],
).to_dict()
```

---

## Model Serving

## FastAPI for Real-time Serving

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import mlflow.pyfunc
import pandas as pd
import numpy as np

app = FastAPI(title="Churn Prediction API", version="1.0")

# Load production model from registry
model = mlflow.pyfunc.load_model(model_uri="models:/customer-churn-rf/Production")

class PredictionRequest(BaseModel):
    user_id: int
    age: float = Field(..., ge=0, le=120)
    tenure: int = Field(..., ge=0)
    monthly_spend: float = Field(..., ge=0)
    total_spend: float = Field(..., ge=0)
    num_purchases: int = Field(..., ge=0)

class PredictionResponse(BaseModel):
    user_id: int
    churn_probability: float
    prediction: str
    confidence: str

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    try:
        df = pd.DataFrame([request.model_dump()])
        prob = float(model.predict_proba(df)[:, 1][0])
        pred = "churn" if prob > 0.5 else "retain"

        confidence = "high" if abs(prob - 0.5) > 0.35 else "medium" if abs(prob - 0.5) > 0.15 else "low"

        return PredictionResponse(
            user_id=request.user_id,
            churn_probability=round(prob, 4),
            prediction=pred,
            confidence=confidence,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": model is not None}

# Run: uvicorn main:app --host 0.0.0.0 --port 8000
```

## Batch Prediction Pipeline

```python
from prefect import flow, task

@task
def load_model():
    return mlflow.pyfunc.load_model("models:/customer-churn-rf/Production")

@task
def load_batch(path):
    return pd.read_parquet(path)

@task
def predict_batch(model, df):
    features = df[["age", "tenure", "monthly_spend", "total_spend", "num_purchases"]]
    predictions = model.predict(features)
    probabilities = model.predict_proba(features)[:, 1]
    df["prediction"] = predictions
    df["churn_probability"] = probabilities
    return df

@task
def save_results(df, output_path):
    df.to_parquet(output_path, index=False)

@flow
def batch_prediction_flow(input_path, output_path):
    model = load_model()
    df = load_batch(input_path)
    results = predict_batch(model, df)
    save_results(results, output_path)
```

## Streaming Prediction

```python
from kafka import KafkaConsumer, KafkaProducer
import json

consumer = KafkaConsumer(
    "user-events",
    bootstrap_servers=["localhost:9092"],
    value_deserializer=lambda m: json.loads(m.decode("utf-8")),
    auto_offset_reset="earliest",
)

producer = KafkaProducer(
    bootstrap_servers=["localhost:9092"],
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
)

for message in consumer:
    event = message.value
    user_id = event["user_id"]

    # Fetch online features
    features = store.get_online_features(
        entity_rows=[{"user_id": user_id}],
    ).to_dict()

    # Predict
    prob = model.predict_proba(pd.DataFrame([features]))[0, 1]

    # Publish result
    result = {"user_id": user_id, "churn_probability": prob}
    producer.send("churn-predictions", result)

consumer.close()
producer.close()
```

---

## Containerization with Docker

```dockerfile
# Dockerfile for ML serving
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install MLflow and model (pulled from registry in production)
COPY ./app ./app

# Copy model (in production, use mlflow models pull or volume mount)
COPY models/model.pkl ./models/

ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Run with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build and run
docker build -t churn-api:1.0 .
docker run -p 8000:8000 --name churn-api churn-api:1.0

# For GPU support
docker run --gpus all -p 8000:8000 churn-api:1.0
```

---

## Kubernetes for ML

## Kubeflow Pipelines

Orchestrates complex ML workflows on Kubernetes with automatic retry, caching, and visualization.

## KServe (formerly KFServing)

Standardized inference server for ML models:

```yaml
# inference-service.yaml
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: churn-predictor
  annotations:
    autoscaling.knative.dev/target: "10"
spec:
  predictor:
    minReplicas: 1
    maxReplicas: 5
    model:
      modelFormat:
        name: sklearn
      storageUri: "s3://models/churn-rf/"
      resources:
        limits:
          cpu: "1"
          memory: 2Gi
```

## Seldon Core

Alternative to KServe for deploying ML models with A/B testing, canary deployments, and multi-arm bandits.

---

## CI/CD for ML

ML CI/CD extends traditional software CI/CD with ML-specific stages:

```yaml
# .github/workflows/ml-pipeline.yml
name: ML Pipeline

on:
  push:
    branches: [main]
    paths: ['data/**', 'src/**', 'models/**']
  schedule:
    - cron: '0 2 * * *'  # Daily retraining

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run unit tests
        run: pytest tests/ -v

      - name: Validate data schema
        run: python -m great_expectations checkpoint validate training_data

  train:
    needs: test
    runs-on: gpu-runner
    steps:
      - uses: actions/checkout@v4
      - name: Pull training data
        run: dvc pull

      - name: Train model
        run: python src/train.py
        env:
          MLFLOW_TRACKING_URI: ${{ secrets.MLFLOW_URI }}

      - name: Evaluate model
        run: python src/evaluate.py

      - name: Register if performance improved
        if: steps.eval.outputs.improved == 'true'
        run: mlflow models register -m runs:/<run_id>/model -n customer-churn-rf --stage Staging

  deploy-staging:
    needs: train
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: kubectl apply -f k8s/staging/inference-service.yaml

      - name: Smoke test
        run: python tests/smoke_test.py --env staging

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Promote to production
        run: |
          mlflow models transition -n customer-churn-rf -v 1 --stage Production
          kubectl apply -f k8s/production/inference-service.yaml
```

---

## Model Monitoring

## Data Drift Detection

```python
import numpy as np
from scipy import stats
from evidently.dashboard import Dashboard
from evidently.tabs import DataDriftTab, CatTargetDriftTab

# Population Stability Index (PSI)
def calculate_psi(expected, actual, buckets=10):
    breakpoints = np.percentile(expected, np.linspace(0, 100, buckets + 1))
    expected_perc = np.histogram(expected, bins=breakpoints)[0] / len(expected)
    actual_perc = np.histogram(actual, bins=breakpoints)[0] / len(actual)

    # Handle zeros
    expected_perc = np.where(expected_perc == 0, 0.0001, expected_perc)
    actual_perc = np.where(actual_perc == 0, 0.0001, actual_perc)

    psi = np.sum((actual_perc - expected_perc) * np.log(actual_perc / expected_perc))
    return psi

# PSI interpretation
# < 0.1: no significant drift
# 0.1 - 0.2: moderate drift, monitor closely
# > 0.2: significant drift, retraining recommended

# Evidently AI for comprehensive monitoring
dashboard = Dashboard(tabs=[
    DataDriftTab(),
    CatTargetDriftTab(),
])
dashboard.calculate(
    reference_data=reference_df,
    current_data=current_df,
    column_mapping=ColumnMapping(
        target="churn",
        prediction="churn_probability",
    )
)
dashboard.save("monitoring_report.html")
```

## Concept Drift Detection

```python
from skmultiflow.drift_detection import ADWIN, DDM

drift_detector = ADWIN()

for i, (X, y) in enumerate(stream):
    prediction = model.predict(X)
    drift_detector.add_element(int(prediction != y))

    if drift_detector.detected_change():
        print(f"Drift detected at instance {i}")
        # Trigger retraining pipeline
        trigger_retraining()
```

## Performance Monitoring

Track key metrics over time:

```python
# Prometheus metrics exporter
from prometheus_client import Counter, Histogram, Gauge

REQUEST_COUNT = Counter(
    "churn_prediction_requests_total",
    "Total number of predictions",
    ["status"]
)
REQUEST_LATENCY = Histogram(
    "churn_prediction_latency_seconds",
    "Prediction latency",
    buckets=[0.01, 0.05, 0.1, 0.5, 1.0]
)
MODEL_ACCURACY = Gauge(
    "churn_model_accuracy",
    "Latest model accuracy score"
)

@app.middleware("http")
async def track_metrics(request, call_next):
    with REQUEST_LATENCY.time():
        response = await call_next(request)
    REQUEST_COUNT.labels(status=response.status_code).inc()
    return response

# Periodically update model accuracy metric
async def update_accuracy():
    while True:
        metrics = client.query('churn_validation_f1')
        MODEL_ACCURACY.set(metrics)
        await asyncio.sleep(3600)
```

---

## A/B Testing for ML Models

```python
import numpy as np
from scipy import stats

# Two-proportion z-test
def ab_test(control_metrics, treatment_metrics, alpha=0.05):
    n_control = len(control_metrics)
    n_treatment = len(treatment_metrics)
    p_control = np.mean(control_metrics)
    p_treatment = np.mean(treatment_metrics)

    # Pooled proportion
    p_pooled = (p_control * n_control + p_treatment * n_treatment) / (n_control + n_treatment)
    se = np.sqrt(p_pooled * (1 - p_pooled) * (1/n_control + 1/n_treatment))

    z_stat = (p_treatment - p_control) / se
    p_value = 2 * (1 - stats.norm.cdf(abs(z_stat)))

    significant = p_value < alpha
    lift = (p_treatment - p_control) / p_control * 100

    return {
        "control_rate": p_control,
        "treatment_rate": p_treatment,
        "z_statistic": z_stat,
        "p_value": p_value,
        "significant": significant,
        "lift_percent": lift,
    }

# Example: comparing conversion rates
control_conversions = np.random.binomial(1, 0.05, 10000)
treatment_conversions = np.random.binomial(1, 0.058, 10000)

result = ab_test(control_conversions, treatment_conversions)
print(f"Treatment lift: {result['lift_percent']:.2f}%")
print(f"Statistically significant: {result['significant']}")
```

---

## MLOps Best Practices

| Practice | Description |
|---|---|
| **Reproducibility** | Version data, code, config, and models. Use seeds. Log everything. |
| **Automation** | Automate pipelines end-to-end. Remove manual steps. |
| **Testing** | Data validation, unit tests, integration tests, model performance gates |
| **Staging environment** | Always test in staging before production deployment |
| **Gradual rollout** | Canary deployments, blue-green deployments, feature flags |
| **Monitoring** | Track data drift, concept drift, model accuracy in production |
| **Rollback capability** | Keep previous model versions ready for quick rollback |
| **Separation of concerns** | Data engineers, ML engineers, and scientists have distinct responsibilities |
| **Cost management** | Right-size compute, use spot instances for training, batch inference |

---

## Interview Q&A

### 1) Data Drift vs Concept Drift: what is the practical difference?

Data drift means the input feature distribution changed (e.g., user age distribution shifted from young to older). Concept drift means the relationship between features and target changed (e.g., churn definition changed or user behavior evolved). Both require different responses: data drift may need preprocessing updates, concept drift usually requires retraining.

### 2) How do you handle model retraining in production?

Define automated triggers (schedule, data drift threshold, performance degradation), maintain a staging environment, use shadow deployment before full rollout, and always keep a rollback path. Canary deployment with gradual traffic shifting is the safest approach.

### 3) Why is reproducibility important in ML and how do you achieve it?

ML models can vary due to random initialization, non-deterministic operations, data ordering, and environment differences. Achieve reproducibility through: fixing random seeds, Docker containerization, data versioning (DVC), experiment tracking (MLflow), and immutability of training environments.

### 4) What is the difference between batch and real-time serving?

Batch serving processes large volumes on a schedule (cost-effective for infrequent predictions). Real-time serving responds immediately to individual requests (low latency required). Streaming serves in near-real-time from event streams (middle ground, good for high-throughput scenarios).

### 5) How do you prevent data leakage in ML pipelines?

Apply all preprocessing transformations within cross-validation folds, not on the full dataset before splitting. Use separate environments for training and serving features. Regularly audit features for temporal leakage (future information leaking into past).

### 6) When would you choose Kubeflow vs a simpler orchestrator like Prefect?

Kubeflow for enterprise-scale, multi-team Kubernetes-native environments with complex distributed training needs. Prefect for simpler pipelines, faster iteration, and smaller teams that want Python-native workflow orchestration without Kubernetes overhead.
