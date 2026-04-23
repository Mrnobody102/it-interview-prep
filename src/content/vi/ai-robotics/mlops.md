# MLOps & AI Production

## Tổng quan

MLOps (Machine Learning Operations) áp dụng các nguyên tắc DevOps vào vòng đời machine learning. Đến năm 2026, chủ đề này cũng chồng lấn mạnh với AI production như LLMOps, evaluation pipeline, retrieval quality, prompt và model versioning, cùng observability cho các hệ thống chạy bằng model.

Nguyên tắc cốt lõi: đối xử với các ML models như software artifacts, với version control, testing, CI/CD, và monitoring.

## Các Giai đoạn của ML Pipeline

Một ML pipeline production gồm các giai đoạn kết nối với nhau:

```
Data Collection -> Data Validation -> Data Preprocessing ->
Feature Engineering -> Model Training -> Model Evaluation ->
Model Validation -> Model Serving -> Monitoring
```

Mỗi giai đoạn nên:

- **Reproducible:** cùng inputs luôn tạo ra cùng outputs
- **Versioned:** data, code, config, và model versions được track
- **Testable:** data schema checks, model performance gates
- **Automated:** được trigger bởi events hoặc schedules, không phải chạy thủ công

---

## Quản lý Dữ liệu

## Data Versioning

Dữ liệu thay đổi theo thời gian (data drift, schema evolution). Versioning datasets cho phép:

- Reproducing model training với các data versions cụ thể
- A/B testing models được train trên các dữ liệu khác nhau
- Rollback về các data states trước đó

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

Các checks tự động trước khi training:

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

MLflow là nền tảng experiment tracking open-source được sử dụng rộng rãi nhất.

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

## Model Versioning và Registry

Model registry tập trung model versioning, metadata, và promotion qua các stages.

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

## Alternative: Model versioning với DVC + Git

```bash
# Tag model với git và dvc
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

Feature store cung cấp:

- **Offline storage:** cho training (parquet files, data lake)
- **Online storage:** cho real-time serving (Redis, DynamoDB)
- **Consistency:** cùng feature computation cho training và serving

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

## FastAPI cho Real-time Serving

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

## Containerization với Docker

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

## Kubernetes cho ML

## Kubeflow Pipelines

Điều phối các ML workflows phức tạp trên Kubernetes với automatic retry, caching, và visualization.

## KServe (trước đây là KFServing)

Inference server tiêu chuẩn cho ML models:

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

Alternative cho KServe để deploy ML models với A/B testing, canary deployments, và multi-arm bandits.

---

## CI/CD cho ML

ML CI/CD mở rộng traditional software CI/CD với các giai đoạn đặc thù ML:

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

## Phát hiện Data Drift

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

# Evidently AI cho comprehensive monitoring
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

## Phát hiện Concept Drift

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

Theo dõi các key metrics theo thời gian:

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

## A/B Testing cho ML Models

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

| Thực hành | Mô tả |
|---|---|
| **Reproducibility** | Version data, code, config, và models. Dùng seeds. Log mọi thứ. |
| **Automation** | Tự động hóa pipelines end-to-end. Loại bỏ các bước thủ công. |
| **Testing** | Data validation, unit tests, integration tests, model performance gates |
| **Staging environment** | Luôn test trong staging trước khi production deployment |
| **Gradual rollout** | Canary deployments, blue-green deployments, feature flags |
| **Monitoring** | Track data drift, concept drift, model accuracy trong production |
| **Rollback capability** | Giữ các model versions trước đó sẵn sàng cho quick rollback |
| **Separation of concerns** | Data engineers, ML engineers, và scientists có các trách nhiệm riêng biệt |
| **Cost management** | Right-size compute, dùng spot instances cho training, batch inference |

---

## LLMOps và GenAI Evaluation

Đến năm 2026, MLOps thường mở rộng thành cả LLMOps và AI production nói chung.

Điều đó đưa thêm nhiều "đối tượng vận hành" mới:

- prompt và system instruction
- retrieval index và chunker
- tool schema
- evaluation set cho agent workflow
- safety policy và moderation rule

Các metric quan trọng bây giờ gồm:

- chất lượng câu trả lời
- groundedness
- hallucination rate
- retrieval precision
- độ đúng của tool-call
- latency và cost trên mỗi task

Với model-powered systems, metric kiểu cổ điển cho model thôi là không đủ.

---

## Embodied AI Operations và Fleet Learning

Robotics thêm độ phức tạp vận hành vượt xa deploy ML thông thường.

Các mối quan tâm quan trọng:

- thu thập robot telemetry
- log sensor và action đã được đồng bộ
- intervention logging
- shadow evaluation trước khi cấp quyền autonomy
- rollout và rollback theo cả fleet
- dataset curation từ kinh nghiệm chạy robot thật

Điều này thường tạo thành learning loop:

1. deploy cẩn thận
2. thu thập failure và intervention
3. label và curate dữ liệu
4. retrain hoặc refine policy
5. replay và validate
6. redeploy dần dần

Trong robotics, learning loop này thường có giá trị hơn việc cố kiếm thêm một chút benchmark score.

---

## Human Feedback và Data Flywheels

Nhiều hệ AI hiện đại cải thiện nhờ operational feedback:

- annotation pipeline
- preference label
- demonstrations
- corrective interventions
- incident review

"Data flywheel" chỉ thực sự mạnh khi dữ liệu:

- có timestamp đúng
- có thể reproduce
- truy vết được tới model hoặc policy version
- được lọc chất lượng

Nếu thiếu các nền tảng đó thì nhiều data hơn chỉ tạo thêm nhiễu.

---

## Robot data lake và log đồng bộ theo thời gian

Robotics MLOps cần một data contract chặt hơn nhiều standard ML stack.

Các artifact quan trọng cần được log gồm:

- camera frames
- depth hoặc lidar streams
- proprioception và force data
- transforms và calibration version
- action commands và controller states
- interventions, override, và incidents
- software version, model version, và hardware metadata

Điểm then chốt là đồng bộ thời gian.

Nếu timestamp bị lệch hoặc sensor không được căn chỉnh đúng, quá trình train downstream có thể âm thầm học sai quan hệ state-action.

Đó là lý do nền tảng dữ liệu tốt cho robotics thường nhấn mạnh:

- replayable logs
- calibration có version
- clock source nhất quán
- khả năng truy vết từ hành vi của model ngược về raw episode

Trong thực tế, rất nhiều bug khó trong robotics là bug về data integrity trước khi là bug của model.

---

## Shadow mode, safety gate, và evaluation dựa trên mô phỏng

Trước khi cấp thêm quyền autonomy cho một hệ học được, team thường muốn nhiều lớp bằng chứng:

1. offline replay trên historical logs
2. simulation regression trên các scenario đã biết
3. shadow mode chạy song song với policy hiện tại
4. rollout dần trên các task bị giới hạn
5. approval gate hoặc rollback gate tường minh

Các metric hữu ích gồm:

- intervention rate
- số near-miss
- mức bất đồng với baseline policy
- recovery success rate
- end-to-end latency dưới tải thực tế

Với physical AI, evaluation phải trả lời nhiều hơn câu hỏi "trung bình có chạy được không?"

Nó còn phải trả lời:

- khi nào hệ thất bại?
- failure quan sát được tới mức nào?
- hệ có thể fall back nhanh ra sao?
- failure có thể reproduce và audit được không?

Đó là câu hỏi về deployment, không chỉ là câu hỏi modeling.

---

## Câu hỏi Phỏng vấn

### 1) Data Drift vs Concept Drift: khác biệt thực tế là gì?

Data drift có nghĩa là phân phối input feature thay đổi (ví dụ: phân phối tuổi người dùng chuyển từ trẻ sang già). Concept drift có nghĩa là mối quan hệ giữa features và target thay đổi (ví dụ: định nghĩa churn thay đổi hoặc hành vi người dùng tiến hóa). Cả hai đều cần các phản ứng khác nhau: data drift có thể cần cập nhật preprocessing, concept drift thường cần retraining.

### 2) Làm sao xử lý model retraining trong production?

Định nghĩa các triggers tự động (schedule, data drift threshold, performance degradation), duy trì một staging environment, sử dụng shadow deployment trước khi rollout hoàn toàn, và luôn giữ một rollback path. Canary deployment với gradual traffic shifting là cách tiếp cận an toàn nhất.

### 3) Tại sao reproducibility quan trọng trong ML và làm sao đạt được nó?

ML models có thể khác nhau do random initialization, các operations không deterministic, data ordering, và environment differences. Đạt được reproducibility qua: fixing random seeds, Docker containerization, data versioning (DVC), experiment tracking (MLflow), và immutability của training environments.

### 4) Khác nhau giữa batch và real-time serving là gì?

Batch serving xử lý khối lượng lớn theo schedule (tiết kiệm chi phí cho các predictions không thường xuyên). Real-time serving phản hồi ngay lập tức cho các requests riêng lẻ (cần độ trễ thấp). Streaming serves gần real-time từ event streams (middle ground, tốt cho các kịch bản high-throughput).

### 5) Làm sao ngăn chặn data leakage trong ML pipelines?

Áp dụng tất cả các transformations preprocessing trong các cross-validation folds, không phải trên full dataset trước khi splitting. Sử dụng các environments riêng biệt cho training và serving features. Thường xuyên audit features cho temporal leakage (future information leaking into past).

### 6) Khi nào chọn Kubeflow vs một orchestrator đơn giản hơn như Prefect?

Kubeflow cho enterprise-scale, multi-team Kubernetes-native environments với complex distributed training needs. Prefect cho simpler pipelines, faster iteration, và smaller teams muốn Python-native workflow orchestration mà không có Kubernetes overhead.

### 7) Vì sao LLMOps khác classic MLOps?

Vì chất lượng hệ deploy không chỉ phụ thuộc vào model weights mà còn phụ thuộc vào prompt, retrieval, tools, policy và workflow orchestration.

### 8) Vì sao robotics MLOps đặc biệt khó?

Vì dữ liệu là dữ liệu đa modality, cần đồng bộ theo thời gian, phụ thuộc phần cứng, nhạy cảm về safety, và thường đắt khi thu thập hoặc replay đúng cách.

### 9) Vì sao tính toàn vẹn timestamp là mối quan tâm MLOps hạng nhất trong robotics?

Vì model học từ quan hệ giữa observation, action, và outcome theo thời gian. Timestamp lệch có thể làm hỏng quan hệ đó dù từng sensor log riêng lẻ nhìn vẫn đúng.

### 10) Shadow mode là gì và vì sao nó có giá trị trước khi rollout autonomy?

Shadow mode cho phép model mới quan sát input thật và sinh quyết định mà chưa điều khiển robot. Nhờ đó team thấy được pattern bất đồng, edge case, và rủi ro safety trước khi model được phép hành động.
