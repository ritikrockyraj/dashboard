# 🏦 Loan Default Prediction — Production MLOps Pipeline — Complete Handbook

> **Repository:** [Loan-Approval-Prediction-with-Production-MLOps-Pipeline](https://github.com/ritikrockyraj/Loan-Approval-Prediction-with-Production-MLOps-Pipeline)
> **Author:** Ritik Rocky Raj
> **Difficulty:** 🟡 Intermediate | **Resume Rating:** Medium | **Interview Rating:** Medium-Hard

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#part-1-project-overview)
2. [Complete Story](#part-2-complete-story)
3. [Workflow](#part-3-workflow)
4. [Folder Structure](#part-4-folder-structure)
5. [Code Flow](#part-5-code-flow)
6. [Tech Stack Explanation](#part-6-tech-stack-explanation)
7. [File-by-File Explanation](#part-7-file-by-file-explanation)
8. [API Explanation](#part-8-api-explanation)
9. [AI/ML Explanation](#part-10-aiml-explanation)
10. [Interview Preparation](#part-11-interview-preparation)
11. [How to Approach in Interview](#part-12-how-to-approach-this-project-in-an-interview)
12. [Interview Questions](#part-13-interview-questions)
13. [HR Questions](#part-14-hr-questions)
14. [System Design Discussion](#part-15-system-design-discussion)
15. [Common Bugs](#part-16-common-bugs)
16. [Resume Explanation](#part-17-resume-explanation)
17. [Learning Roadmap](#part-19-learning-roadmap)
18. [Flashcards](#part-20-flashcards)
19. [Revision Notes](#part-21-revision-notes)
20. [Cheat Sheet](#part-22-cheat-sheet)
21. [Communication Trainer](#part-24-communication-trainer)
22. [PDF-Ready Summary](#part-18-pdf-generation-content)

---

## PART 1: PROJECT OVERVIEW

### 📌 Project Name
**Loan Default Prediction with Production MLOps Pipeline**

### 🎯 Problem Statement
Lending companies (like LendingClub) issue thousands of loans. Some borrowers repay fully, some don't. **Manually predicting who will default is impossible at scale.** This project builds an ML system that predicts loan defaults AND packages it with production-grade engineering practices — the way real data teams work.

### ❓ Why This Exists
- Demonstrates MLOps — not just ML, but the ENGINEERING around it
- Shows you understand production patterns: config-driven code, experiment tracking, model registry, API serving
- Mirrors what a real ML Engineer does daily

### 👥 Who Can Use It
- FinTech companies for automated risk assessment
- Lending platforms for pre-screening borrowers
- Data Science students learning production ML

### 🌍 Real-World Applications
- **Lending:** Predict default probability before issuing a loan
- **Credit Scoring:** Automated risk tier assignment
- **Portfolio Management:** Assess overall loan book health
- **Regulatory Compliance:** Document model decisions for audits

### 📊 Problem Type
**Binary Classification:** Predict `not.fully.paid` (0 = repaid, 1 = defaulted)

### 📈 Dataset
- **Source:** LendingClub historical data (Kaggle: itssuru/loan-data)
- **Size:** 9,578 records, 14 features
- **Class balance:** ~84% repaid, ~16% defaulted (IMBALANCED)

### ✨ Key Features That Make This "Production-Grade"

| Feature | Why It Matters |
|---------|---------------|
| **Config-driven (YAML)** | Change algorithms without touching code |
| **Custom sklearn Transformers** | Reusable feature engineering |
| **sklearn Pipeline** | No data leakage, reproducible transforms |
| **MLflow Experiment Tracking** | Compare runs, log metrics/artifacts |
| **MLflow Model Registry** | Version and promote models to Production |
| **FastAPI REST API** | Serve predictions to any system |
| **Pydantic Schemas** | Automatic input validation |
| **pytest Unit Tests** | Code quality assurance |
| **Makefile** | Standardized commands |
| **Docker** | Containerized deployment |

### 🏗️ Architecture Type
**Modular MLOps Pipeline** — separation of concerns: data → features → models → API

### 🛠️ Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Language** | Python 3.11 |
| **ML** | scikit-learn (RandomForest, GradientBoosting, LogisticRegression) |
| **Tracking** | MLflow 2.9+ |
| **API** | FastAPI + Uvicorn |
| **Validation** | Pydantic |
| **Config** | YAML (PyYAML) |
| **Testing** | pytest |
| **Container** | Docker + docker-compose |
| **CI/CD** | GitHub Actions |
| **Data** | Pandas, NumPy |

### ⏱️ Estimated Development Time
- **Total:** 1-2 weeks
- **EDA:** 1 day
- **Pipeline Development:** 3-4 days
- **MLflow Integration:** 1-2 days
- **API Development:** 1-2 days
- **Testing & Docker:** 1-2 days

### 📈 Resume & Interview Ratings
- **Resume Rating:** Medium — shows production awareness, good for ML Engineer roles
- **Interview Rating:** Medium-Hard — must understand MLOps concepts, sklearn internals, API design

---

> **💡 Interview Tip:** This project differentiates you from candidates who only have "trained a model in Jupyter." You show production thinking — configs, pipelines, APIs, registries, tests. That's what companies want.

---

## PART 2: COMPLETE STORY

### Chapter 1: The Gap Between Coursework and Industry

In college, I trained ML models in Jupyter notebooks. Load CSV, clean, train, evaluate — done. But when I interned at a company, I discovered that's maybe 20% of the job. The other 80% is:

- Making code configurable (not hardcoded paths/params)
- Tracking experiments (which run gave the best results? why?)
- Versioning models (which model is in production right now?)
- Serving predictions reliably (REST API, not `model.predict()` in a notebook)
- Testing code (does the pipeline still work after changes?)
- Containerization (works on my machine ≠ works in production)

This project is my attempt to bridge that gap. It's the same ML I learned in class, but packaged the way a professional team would.

### Chapter 2: The Problem — LendingClub Loan Defaults

LendingClub is a peer-to-peer lending platform. They issued ~9,500+ loans in this dataset. Each loan has features like FICO score, debt-to-income ratio, loan purpose, and interest rate. About 16% of these loans were not fully repaid.

The question: can we predict defaults BEFORE issuing a loan?

This matters because a 1% improvement in default prediction can save millions of dollars for a lending company.

### Chapter 3: Design Philosophy — Config Over Code

I made one key decision early: **nothing should be hardcoded.**

- Which algorithm to use? → In `config/config.yaml`, not in Python
- Where is the data? → In config
- Hyperparameters? → In config
- Test size? → In config

This means you can switch from Logistic Regression to Gradient Boosting by changing ONE line in YAML. No code changes, no bugs introduced. This is how professional teams operate.

### Chapter 4: The Pipeline Architecture

I built the ML pipeline as composable steps:

```mermaid
graph LR
    A[Raw CSV] --> B[Ingestion]
    B --> C[Validation]
    C --> D[Feature Engineering]
    D --> E[sklearn Pipeline]
    E --> F[MLflow Tracking]
    F --> G[Model Registry]
    G --> H[FastAPI Serving]
```

Each step is a separate Python module. You can test each independently. You can swap out any step without breaking others.

### Chapter 5: Why MLflow?

Without MLflow, tracking experiments means Excel sheets or messy notes: "run #47 with RF, n=200, max_depth=15 gave AUC 0.83." With MLflow, EVERY run is automatically logged — parameters, metrics, artifacts, model files. You can compare runs visually in the MLflow UI.

The Model Registry adds staging: models move from Development → Staging → Production. The API always loads the Production model. Updating the model is just promoting a new version.

### Chapter 6: Challenges

**Challenge 1: Class Imbalance**
84% repaid, 16% defaulted. Training naively gives 84% accuracy by always predicting "repaid" — useless. Solution: `class_weight='balanced'` and optimizing for recall on the default class.

**Challenge 2: Feature Engineering as sklearn Transformers**
I needed custom feature engineering that plugs into sklearn Pipelines. Solution: Building a `FeatureCreator` class that inherits from `BaseEstimator, TransformerMixin`. This ensures no data leakage — the transformer is fit on training data only.

**Challenge 3: Model Selection**
Neither Random Forest nor Gradient Boosting dominated. RF had better recall for defaults. GBM had better ROC-AUC. Logistic Regression had the best recall. I kept all three in the pipeline, selectable via config.

**Challenge 4: Production Model Loading**
The API needs the latest production model. But which one is "production"? Solution: MLflow Model Registry stages. The API queries: "give me the `loan_default_model` with stage=`Production`."

### Chapter 7: What I'd Improve

1. Add data drift monitoring (Evidently AI or custom)
2. Implement A/B testing between model versions
3. Add feature store (Feast) for consistent feature computation
4. Orchestrate with Airflow/Prefect instead of manual runs
5. Deploy on Kubernetes for auto-scaling
6. Add SHAP for model explainability

---

> **💡 Interview Tip:** Frame this project as "bridging the gap between academic ML and production ML." Emphasize that you understand: (1) config-driven code, (2) experiment tracking, (3) model registry, (4) API serving. These 4 concepts are MLOps fundamentals.

---

## PART 3: WORKFLOW

### Complete Pipeline Flow

```
┌─────────────────────────────────────────────────────┐
│                  DATA INGESTION                       │
│  load_raw_data("data/raw/loan_data.csv")             │
│  → df with 9,578 rows × 14 columns                  │
│  → get_data_summary(df): shape, dtypes, nulls        │
│  → check_data_quality(df): FICO range, interest rate │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│                DATA VALIDATION                        │
│  LoanDataValidator with COLUMN_RANGES                │
│  → int.rate: (0.05, 0.30)                           │
│  → fico: (600, 850)                                  │
│  → dti: (0, 30)                                      │
│  → If >5% violations → ERROR (stop)                  │
│  → If <5% violations → WARNING (continue + log)      │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│              FEATURE ENGINEERING                      │
│  FeatureCreator (sklearn Transformer)                │
│  Creates 7 new features:                             │
│  • fico_low_risk (fico ≥ 750)                        │
│  • fico_high_risk (fico < 670)                       │
│  • installment_to_income                             │
│  • credit_history_years                              │
│  • high_utilization (revol.util > 80)                │
│  • has_negative_record                               │
│  • many_recent_inquiries                             │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│              SKLEARN PIPELINE                         │
│  ColumnTransformer:                                  │
│  ├── numerical_pipeline (19 features)                │
│  │   ├── SimpleImputer(median)                       │
│  │   └── StandardScaler()                            │
│  └── categorical_pipeline (purpose)                  │
│      ├── SimpleImputer(most_frequent)                │
│      └── OneHotEncoder()                             │
│  → Classifier (RF/GBM/LR)                            │
│  → Prediction                                        │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│             MLflow EXPERIMENT TRACKING                │
│  Per run, logs:                                      │
│  • Parameters: algorithm, hyperparams, train_size    │
│  • Metrics: roc_auc, recall_default, f1_default      │
│  • Artifacts: confusion_matrix.png, roc_curve.png    │
│  • Model: full sklearn Pipeline                      │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│              MODEL REGISTRY                           │
│  ModelRegistry class:                                │
│  → register_model(name="loan_default_model")         │
│  → promote_to_production() if beats current best     │
│  → compare_with_production()                         │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│              FASTAPI SERVING                          │
│  At startup: loads Production model from MLflow       │
│  POST /api/v1/predict: returns prediction + prob     │
│  GET  /api/v1/health: checks model loaded            │
└─────────────────────────────────────────────────────┘
```

---

## PART 4: FOLDER STRUCTURE

```
loan-prediction-mlops/
│
├── config/
│   └── config.yaml              ← SINGLE SOURCE OF TRUTH
│       • data paths              • model algorithm
│       • hyperparameters         • train/test split ratio
│       • MLflow settings         • feature flags
│
├── src/                          ← Installable Python package
│   ├── data/
│   │   ├── ingestion.py          ← load_raw_data(), check_data_quality()
│   │   └── validation.py         ← LoanDataValidator class
│   │
│   ├── features/
│   │   └── build_features.py     ← FeatureCreator (sklearn Transformer)
│   │
│   ├── models/
│   │   ├── train.py              ← MLflow-tracked training
│   │   └── evaluate.py           ← ModelRegistry: compare/promote
│   │
│   └── monitoring/
│       └── (model drift detection)
│
├── api/                          ← REST API (separate from ML code)
│   ├── main.py                   ← FastAPI app, loads model at startup
│   ├── routes/
│   │   ├── predict.py            ← POST /api/v1/predict
│   │   └── health.py             ← GET /api/v1/health
│   └── schemas/
│       └── loan.py               ← Pydantic request/response models
│
├── notebooks/
│   └── 01_eda.ipynb              ← Exploratory Data Analysis
│
├── tests/                        ← pytest unit & integration tests
│   ├── test_ingestion.py
│   ├── test_features.py
│   └── test_api.py
│
├── docker/
│   ├── Dockerfile.api
│   └── Dockerfile.mlflow
│
├── docker-compose.yml            ← MLflow + API together
├── requirements.txt
├── setup.py                      ← pip install -e . (src as package)
├── Makefile                      ← make train, make test, make serve
└── README.md
```

### Why This Structure?

| Folder | Why It Exists | Connects To |
|--------|--------------|-------------|
| `config/` | Changing behavior should not require code changes | All src modules read from config.yaml |
| `src/` as package | `from src.data.ingestion import load_raw_data` works from anywhere | Installed via `setup.py` with `pip install -e .` |
| `api/` separate | ML code and serving code are different concerns | Loads model from MLflow registry |
| `tests/` | Every module has tests — professional standard | pytest discovers automatically |
| `notebooks/` | EDA is exploratory, not production code | Informs feature engineering |

---

> **💡 Interview Tip:** When asked about structure, say: "I separated ML logic (src) from serving logic (api), made src an installable package, and put all configuration in YAML. This is the standard pattern I've seen in production ML codebases."

---

## PART 5: CODE FLOW

### Training Execution

```
python src/models/train.py
      ↓
1. Load config from config/config.yaml
      ↓
2. Load data: src/data/ingestion.py → load_raw_data()
      ↓
3. Validate: src/data/validation.py → LoanDataValidator.validate()
      ↓
4. Create sklearn Pipeline:
   FeatureCreator() → ColumnTransformer → Classifier
      ↓
5. Stratified train_test_split (preserves class ratio)
      ↓
6. Start MLflow run:
   with mlflow.start_run():
      ↓
7. Pipeline.fit(X_train, y_train)
      ↓
8. Evaluate:
   • roc_auc, recall, precision, f1
   • 5-fold cross-validation
      ↓
9. Log to MLflow:
   • mlflow.log_params({...})
   • mlflow.log_metrics({...})
   • mlflow.log_figure(confusion_matrix)
   • mlflow.sklearn.log_model(pipeline)
      ↓
10. ModelRegistry.compare_with_production()
    If new model > production: promote_to_production()
```

### API Serving Flow

```
uvicorn api.main:app --port 8000
      ↓
FastAPI startup event:
  1. Load config
  2. Load Production model from MLflow registry
  3. model = mlflow.sklearn.load_model("models:/loan_default_model/Production")
  4. Store in app.state.model
      ↓
User sends POST /api/v1/predict:
  1. Pydantic validates request body
  2. Extract features → DataFrame
  3. prediction = app.state.model.predict(features)
  4. probability = app.state.model.predict_proba(features)
  5. Return JSON response
```

### Key Function Call Chain

```
train.py:main()
  → load_raw_data(config['data']['raw_path'])
    → pd.read_csv(path)
    → check_data_quality(df)
  → LoanDataValidator(df).validate()
  → create_pipeline(config)
    → FeatureCreator()
    → ColumnTransformer([numerical, categorical])
    → classifier (from config['model']['algorithm'])
  → train_test_split(X, y, stratify=y)
  → pipeline.fit(X_train, y_train)
  → mlflow.log_params(get_pipeline_params())
  → evaluate_model(pipeline, X_test, y_test)
  → ModelRegistry(config).register_and_promote()
```

---

## PART 6: TECH STACK EXPLANATION

### 🐍 Python 3.11
- Latest stable Python with performance improvements (10-60% faster than 3.10)
- All major ML libraries support 3.11

### 📊 scikit-learn
- **Why:** Battle-tested ML library. Key components used: Pipeline, ColumnTransformer, custom Transformers, cross_val_score, metrics
- **Pipeline:** Ensures fit() and transform() happen in correct order, prevents data leakage
- **ColumnTransformer:** Apply different preprocessing to different column types

### 🔬 MLflow
- **What:** Open-source platform for the ML lifecycle by Databricks
- **Components used:**
  - **Tracking:** Log params, metrics, artifacts per run
  - **Model Registry:** Version models, manage stages (Dev → Staging → Prod)
  - **Projects:** (Not used in this project, but available)
- **Why not Weights & Biases?** MLflow is free, self-hosted, open-source. W&B is cloud-hosted, free tier limited.
- **Interview One-liner:** "MLflow is the standard open-source platform for ML experiment tracking and model registry."

### ⚡ FastAPI
- **What:** Modern Python web framework for building APIs (successor to Flask)
- **Why over Flask:** Automatic OpenAPI docs, Pydantic validation, async support, faster
- **Key features:** Type hints → automatic validation, auto-generated Swagger UI at `/docs`
- **Interview One-liner:** "FastAPI is the modern standard for Python APIs — it uses Pydantic for automatic request validation and generates interactive docs."

### ✅ Pydantic
- **What:** Data validation library using Python type annotations
- **Why:** Every API needs to validate inputs. Pydantic does it with zero boilerplate.
- **Example:** `class LoanRequest(BaseModel): fico: int = Field(ge=300, le=850)`

### 🐳 Docker & Docker Compose
- **What:** Containerization — package app + dependencies into a portable unit
- **Why:** "Works on my machine" problem. Docker ensures identical environment everywhere.
- **Docker Compose:** Run MLflow + API together with one command

### 🔄 GitHub Actions
- **What:** CI/CD built into GitHub
- **Why:** Run tests automatically on every push before merging
- **Workflow:** On push → run pytest → run linting → (future: deploy)

### 📋 Makefile
- **What:** Standardized command shortcuts
- **Why:** `make train` is always the same, regardless of what's underneath. Easier onboarding.

---

## PART 7: FILE-BY-FILE EXPLANATION

### `config/config.yaml`
**Purpose:** Central configuration — change behavior without changing code.
**Contents:** Data paths, model algorithm, hyperparameters, MLflow URI, test size.
**Key principle:** "Configuration over hardcoding"

### `src/data/ingestion.py`
**Purpose:** Load raw CSV and perform basic quality checks.
**Key functions:**
- `load_raw_data(path)` → DataFrame
- `get_data_summary(df)` → shape, dtypes, null counts, memory usage
- `check_data_quality(df)` → validates FICO range, interest rate format, target values

### `src/data/validation.py`
**Purpose:** More strict validation with configurable range checks.
**Key class:** `LoanDataValidator`
- Defines `COLUMN_RANGES` for every feature
- Returns violations with severity (ERROR vs WARNING)
- Threshold: >5% violations = ERROR (stop pipeline)

### `src/features/build_features.py`
**Purpose:** Create domain-driven features as a sklearn Transformer.
**Key class:** `FeatureCreator(BaseEstimator, TransformerMixin)`
- Creates 7 new features from raw columns
- Inherits from sklearn base classes → plugs into Pipeline
- `fit()` does nothing (no training data needed), `transform()` creates features

### `src/models/train.py`
**Purpose:** Orchestrate training with MLflow tracking.
**Flow:** Load config → load data → validate → create pipeline → split → train → evaluate → log → register.

### `src/models/evaluate.py`
**Purpose:** Model comparison and registry management.
**Key class:** `ModelRegistry`
- `register_model()` — register trained model
- `compare_with_production()` — is new model better?
- `promote_to_production()` — update production stage

### `api/main.py`
**Purpose:** FastAPI application entry point.
**Key code:**
```python
@app.on_event("startup")
async def load_model():
    app.state.model = mlflow.sklearn.load_model(
        f"models:/{MODEL_NAME}/Production"
    )
```

### `api/schemas/loan.py`
**Purpose:** Pydantic models for request/response validation.
**Example:**
```python
class LoanRequest(BaseModel):
    fico: int = Field(ge=300, le=850, description="FICO credit score")
    int_rate: float = Field(ge=0.0, le=1.0)
    purpose: str
    # ... all 13 features
```

### `tests/`
**Purpose:** Ensure code works correctly after changes.
**Key tests:** Test data loading, test feature creation, test pipeline integrity, test API responses.

---

## PART 8: API EXPLANATION

### `POST /api/v1/predict`

**Method:** POST
**Purpose:** Predict loan default probability for a single applicant.

**Request Body:**
```json
{
  "credit_policy": 1,
  "purpose": "debt_consolidation",
  "int_rate": 0.1189,
  "installment": 829.10,
  "log_annual_inc": 11.35,
  "dti": 19.48,
  "fico": 737,
  "days_with_cr_line": 5639.96,
  "revol_bal": 28854,
  "revol_util": 52.1,
  "inq_last_6mths": 0,
  "delinq_2yrs": 0,
  "pub_rec": 0
}
```

**Response:**
```json
{
  "prediction": 0,
  "probability_default": 0.12,
  "model_version": "loan_default_logistic_regression/Production"
}
```

**Flow:**
1. FastAPI receives POST request
2. Pydantic validates all 13 fields (types, ranges)
3. Converts to pandas DataFrame
4. Passes through production sklearn Pipeline
5. Returns prediction + probability

### `GET /api/v1/health`

**Method:** GET
**Purpose:** Liveness check — is the API running and model loaded?

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_name": "loan_default_model",
  "model_stage": "Production"
}
```

**Used by:** Load balancers, monitoring systems, Docker healthchecks.

---

## PART 9: AI/ML EXPLANATION

### Features Explained

| Feature | Type | Description | Business Meaning |
|---------|------|-------------|-----------------|
| `credit.policy` | Binary | Meets LendingClub criteria | Basic eligibility check |
| `purpose` | Categorical | Loan purpose (7 categories) | Debt consolidation most common |
| `int.rate` | Float | Interest rate (0.05-0.30) | Higher rate = higher risk |
| `installment` | Float | Monthly payment ($) | Affordability indicator |
| `log.annual.inc` | Float | Log of annual income | Already log-transformed |
| `dti` | Float | Debt-to-Income ratio | Key risk metric |
| `fico` | Integer | FICO credit score (612-827) | Most predictive feature |
| `days.with.cr.line` | Float | Credit history length | Longer = more reliable |
| `revol.bal` | Integer | Revolving balance | Unpaid credit card balance |
| `revol.util` | Float | Credit utilization rate (%) | >80% is red flag |
| `inq.last.6mths` | Integer | Recent credit inquiries | 3+ suggests desperation |
| `delinq.2yrs` | Integer | Past-due incidents | Prior delinquency |
| `pub.rec` | Integer | Public records (bankruptcies) | Major red flag |

### Engineered Features

| Feature | Formula | Business Logic |
|---------|---------|---------------|
| `fico_low_risk` | fico ≥ 750 | Excellent credit threshold |
| `fico_high_risk` | fico < 670 | Fair/poor credit threshold |
| `installment_to_income` | installment / monthly_income | Payment burden |
| `credit_history_years` | days / 365 | Human-readable |
| `high_utilization` | revol.util > 80 | Credit maxed out |
| `has_negative_record` | delinq > 0 OR pub_rec > 0 | Any negative history |
| `many_recent_inquiries` | inq ≥ 3 | Credit-seeking behavior |

### Model Performance

| Algorithm | ROC-AUC | Recall (Default) | F1 (Default) |
|-----------|---------|-----------------|--------------|
| Random Forest | 0.83 | 0.65 | 0.45 |
| Gradient Boosting | 0.84 | 0.58 | 0.46 |
| Logistic Regression | 0.78 | **0.72** | 0.42 |

### Key Design Decisions

1. **`class_weight='balanced'`** — Automatically handles 84/16 imbalance
2. **Stratified split** — Preserves class ratio in train AND test
3. **Recall prioritized** — False negatives (approving a defaulter) cost money
4. **Config over hardcoding** — Switch algorithms in YAML, not code
5. **Model Registry stages** — Production model always explicitly tagged

---

## PART 10: INTERVIEW PREPARATION

### 30-Second Introduction
> "I built a production-grade ML pipeline for loan default prediction. It includes config-driven feature engineering, MLflow experiment tracking with model registry, and a FastAPI serving layer. I've benchmarked three algorithms and the pipeline is containerized with Docker."

### 2-Minute Explanation
> "This project goes beyond training a model — it implements an MLOps pipeline the way production teams do. I use LendingClub loan data with 14 features to predict defaults.
>
> The architecture has four layers: data ingestion with quality checks and validation, feature engineering as sklearn custom transformers, MLflow for experiment tracking and model registry, and FastAPI for serving.
>
> Key decisions: everything is config-driven through YAML files — you can change algorithms without touching code. I use sklearn Pipelines with a custom FeatureCreator transformer to prevent data leakage. MLflow tracks every run's parameters, metrics, and artifacts. The model registry manages staging from Development to Production.
>
> The API loads the production model at startup from MLflow. Pydantic validates inputs automatically. The whole system is dockerized with docker-compose for MLflow + API."

### 5-Minute Technical Explanation
*(Add to above:)*
> "Let me explain the pipeline flow. First, `src/data/ingestion.py` loads the CSV and runs quality checks — FICO range 300-850, interest rate as decimal not percentage, target strictly 0 or 1. Then `LoanDataValidator` applies stricter range checks per feature. If more than 5% of rows violate ranges, the pipeline stops with an error.
>
> Feature engineering is done via `FeatureCreator`, which extends scikit-learn's `BaseEstimator` and `TransformerMixin`. This is critical — because it's a proper sklearn transformer, it plugs into the Pipeline and ensures transforms are fit only on training data. I create 7 domain features like `installment_to_income` and `fico_low_risk`.
>
> The full pipeline is: FeatureCreator → ColumnTransformer (numerical + categorical preprocessing) → Classifier. ColumnTransformer has two branches: numerical (SimpleImputer with median + StandardScaler) and categorical (SimpleImputer with mode + OneHotEncoder for 'purpose').
>
> Training is in `src/models/train.py`. With MLflow, I log parameters (algorithm, hyperparameters), metrics (roc_auc, recall for default class, f1), and artifacts (confusion matrix, ROC curve, classification report). The model is logged as an MLflow sklearn model.
>
> `ModelRegistry` in `evaluate.py` wraps MLflow's registry. After training, it registers the model, compares with the current Production model, and promotes if the new model has better recall-default or roc_auc.
>
> The FastAPI app in `api/main.py` loads the Production model on startup using `mlflow.sklearn.load_model()`. The predict endpoint accepts 13 features, validates via Pydantic, and returns prediction with probability. There's also a health check endpoint."

---

## PART 11: INTERVIEW QUESTIONS

### 🟢 EASY

**Q1: What is MLOps?**
> MLOps (Machine Learning Operations) is the practice of applying DevOps principles to ML systems — automating the ML lifecycle from data preparation to deployment and monitoring. It covers experiment tracking, model versioning, CI/CD for ML, and production monitoring.

**Q2: Why use sklearn Pipelines?**
> Pipelines prevent data leakage by ensuring fit() operations (like scaling) happen only on training data. They also make the code cleaner — one `.fit()` trains everything, one `.predict()` transforms and predicts.

**Q3: What is MLflow?**
> MLflow is an open-source platform for managing the ML lifecycle. It has four components: Tracking (log experiments), Projects (package code), Models (package models), and Registry (version and stage models).

### 🟡 MEDIUM

**Q4: Explain stratified train_test_split.**
> Standard random split might give test set with 20% defaults when training had 16%. Stratified split preserves the class ratio in both sets. `train_test_split(X, y, stratify=y)` ensures consistent evaluation.

**Q5: How does the custom FeatureCreator work?**
> It inherits from `BaseEstimator` and `TransformerMixin`. `fit()` is a no-op (no training needed). `transform()` takes a DataFrame, creates 7 binary/numeric features, and returns the augmented DataFrame. Because it's a sklearn transformer, it integrates into Pipelines.

**Q6: How does the API get the "latest" model?**
> The API queries MLflow Model Registry: `mlflow.sklearn.load_model("models:/loan_default_model/Production")`. The "Production" stage is explicitly set when a model is promoted. This decouples model updates from API deployments.

### 🔴 HARD

**Q7: How would you implement data drift detection?**
> I'd monitor the distribution of input features over time using statistical tests (Kolmogorov-Smirnov for numerical, Chi-squared for categorical). When distributions shift significantly (p < 0.05), trigger an alert. Tools: Evidently AI, Great Expectations, or custom monitoring in `src/monitoring/`.

**Q8: Walk me through the ColumnTransformer setup.**
> The ColumnTransformer has two branches: `numerical_pipeline` (19 features → SimpleImputer(median) → StandardScaler) and `categorical_pipeline` (1 feature 'purpose' → SimpleImputer(most_frequent) → OneHotEncoder(handle_unknown='ignore')). The `remainder='drop'` parameter drops any columns not explicitly handled.

**Q9: Why separate `src/` and `api/`?**
> Separation of concerns. ML code (src) handles data, features, training. API code handles HTTP, validation, serving. They evolve independently. You can update the model without touching API code, and vice versa. In production, they might even be separate services.

---

## PART 12: SYSTEM DESIGN DISCUSSION

### Production Architecture Vision

```
                  ┌─────────────┐
                  │   Nginx     │ (Reverse Proxy + Rate Limiting)
                  └──────┬──────┘
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
      ┌──────────┐ ┌──────────┐ ┌──────────┐
      │FastAPI #1│ │FastAPI #2│ │FastAPI #3│  (3 replicas)
      └────┬─────┘ └────┬─────┘ └────┬─────┘
           │             │            │
           └─────────────┼────────────┘
                         │
              ┌──────────▼──────────┐
              │   MLflow Registry   │  (Production model)
              └─────────────────────┘
                         │
              ┌──────────▼──────────┐
              │    PostgreSQL       │  (Prediction history)
              └─────────────────────┘
                         │
              ┌──────────▼──────────┐
              │  Monitoring Stack   │  (Prometheus + Grafana)
              └─────────────────────┘
```

### Key Production Additions

| Concern | Current | Production |
|---------|---------|------------|
| **Scalability** | Single uvicorn | 3+ replicas behind Nginx |
| **Rate Limiting** | None | Nginx or FastAPI middleware |
| **Authentication** | None | JWT or API keys |
| **Database** | None (stateless) | PostgreSQL for prediction audit |
| **Caching** | None | Redis for frequent requests |
| **Monitoring** | MLflow UI | Prometheus + Grafana |
| **CI/CD** | Manual | GitHub Actions → Docker → Deploy |
| **Scheduling** | Manual training | Airflow/Prefect for retraining |

---

## PART 13: RESUME EXPLANATION

### One-Line
> Built production MLOps pipeline for loan default prediction with config-driven feature engineering, MLflow experiment tracking, model registry, and FastAPI serving.

### Two-Line
> Developed end-to-end MLOps pipeline for binary loan default classification using scikit-learn, MLflow, and FastAPI. Implemented config-driven architecture, custom sklearn transformers, stratified evaluation, and containerized deployment.

### ATS Bullet Points
- 🏗️ **Architected** a modular MLOps pipeline with config-driven design (YAML), decoupling algorithm selection, hyperparameters, and data paths from application code
- 🔧 **Built** custom sklearn Transformer (`FeatureCreator`) creating 7 domain-specific features, integrated into sklearn Pipeline with ColumnTransformer for leak-proof preprocessing
- 📊 **Implemented** MLflow experiment tracking logging parameters, metrics (ROC-AUC: 0.84), 5-fold CV scores, confusion matrices, and serialized model artifacts
- 🏭 **Designed** Model Registry workflow with Development/Staging/Production stages, enabling safe model promotion based on recall and ROC-AUC benchmarks
- ⚡ **Developed** FastAPI inference service with Pydantic validation, production model auto-loading from MLflow Registry, and interactive Swagger documentation
- 🐳 **Containerized** the full stack (MLflow tracking server + FastAPI) with Docker Compose for reproducible deployment
- ✅ **Authored** pytest unit tests for data ingestion, feature engineering, and API endpoints

---

## PART 14: FLASHCARDS

| # | Question | Answer |
|---|----------|--------|
| 1 | Problem type? | Binary classification (default vs repay) |
| 2 | Algorithms? | RandomForest, GradientBoosting, LogisticRegression |
| 3 | Best ROC-AUC? | Gradient Boosting: 0.84 |
| 4 | Best Recall? | Logistic Regression: 0.72 |
| 5 | Why config-driven? | Change algorithms without code changes |
| 6 | Custom Transformer? | FeatureCreator(TransformerMixin) — 7 features |
| 7 | MLflow components used? | Tracking + Model Registry |
| 8 | API framework? | FastAPI + Pydantic |
| 9 | Model loading? | From MLflow Registry, stage=Production |
| 10 | Imbalance handling? | class_weight='balanced' + stratified split |
| 11 | Validation? | LoanDataValidator with range checks |
| 12 | Containerization? | Docker Compose (MLflow + API) |

---

## PART 15: CHEAT SHEET

```
╔══════════════════════════════════════════════════════════╗
║        LOAN DEFAULT MLOPS PIPELINE — CHEAT SHEET         ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  🏗️ ARCHITECTURE:                                        ║
║     Data → Features → Pipeline → MLflow → FastAPI        ║
║                                                          ║
║  📁 KEY FOLDERS:                                         ║
║     config/ (YAML) | src/ (package) | api/ (serving)     ║
║     tests/ | notebooks/ | docker/                        ║
║                                                          ║
║  🔄 PIPELINE:                                            ║
║     FeatureCreator → ColumnTransformer → Classifier       ║
║     ├── numerical: Imputer(median) → StandardScaler      ║
║     └── categorical: Imputer(mode) → OneHotEncoder       ║
║                                                          ║
║  📊 MODELS (ROC-AUC / Recall):                           ║
║     RF: 0.83/0.65 | GBM: 0.84/0.58 | LR: 0.78/0.72      ║
║                                                          ║
║  🔬 MLflow:                                              ║
║     Tracking (params+metrics+artifacts) + Registry        ║
║     Stages: Development → Staging → Production            ║
║                                                          ║
║  ⚡ API:                                                 ║
║     POST /api/v1/predict  →  {prediction, prob}          ║
║     GET  /api/v1/health   →  {status, model_loaded}      ║
║                                                          ║
║  🛠️ TECH: Python3.11 | sklearn | MLflow | FastAPI        ║
║           Pydantic | Docker | pytest | GitHub Actions     ║
║                                                          ║
║  🎤 TALKING POINTS:                                      ║
║     "Production MLOps, not just a notebook"               ║
║     "Config-driven — change algorithms in YAML"          ║
║     "Model Registry with Production stages"              ║
║     "7 engineered features as sklearn Transformer"       ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## PART 16: FINAL CHECKLIST

- [ ] Can you explain what MLOps means and why it matters?
- [ ] Can you walk through the full pipeline?
- [ ] Can you explain why sklearn Pipelines prevent data leakage?
- [ ] Do you understand FeatureCreator (custom Transformer)?
- [ ] Can you explain MLflow Tracking vs Registry?
- [ ] Can you describe the API request/response flow?
- [ ] Can you name 3 production improvements?
- [ ] Do you know why class_weight='balanced' matters?
- [ ] Can you explain stratified split?

---

> **💡 Final Tip:** This project shows production thinking. When interviewers ask "have you worked on production ML systems?" — this is your answer. Emphasize the MLOps practices: configs, pipelines, tracking, registry, API, tests, Docker. That's what separates a data scientist from an ML engineer. 🚀
