# \# ML Integration Platform

# 

# FastAPI + React app that runs twelve independently-written ML models behind one

# uniform interface: upload CSV → EDA → pick model → train → evaluate → predict.

# 

# Built by the integration team (Group 16). The twelve model groups submit via

# pull request and never touch anything outside their own folder.

# 

# \## Current state

# 

# As of Session 1, the repo has: `backend/models/base\_model.py`,

# `backend/models/example\_logistic\_regression/` (a complete reference model with

# tests), and the twelve `backend/models/group\_\*/` submission folders (untouched,

# unregistered). Nothing under `backend/app/` exists yet — no FastAPI app, no

# `registry.py`, no routes. That gets built in Sessions 2-4.

# 

# The twelve group submissions are NOT integrated and must not be registered or

# imported until explicitly instructed, well after Session 1.

# 

# Reference models live in `backend/tests/reference\_models/`:

# `example\_logistic\_regression` counts as the classifier reference (adapt the

# existing one or treat it as-is — don't duplicate it). K-Means, Linear

# Regression, and PCA references still need to be built there, one file each, to

# cover the clusterer, regressor, and dimensionality\_reducer paths.

# 

# \## Read these before making design decisions

# 

# \- `ARCHITECTURE.md` — stack, repo layout, API endpoint table, CI, deployment

# \- `DATA\_FLOW\_GUIDE.md` — what happens to a dataset at each stage

# \- `CODING\_STANDARDS.md` — §4 input contract, §7 output contract, §8 metadata

# 

# These are locked. Backend code adapts to the contract; the contract does not

# adapt to the code. If something in them appears wrong, say so and stop — do not

# silently work around it.

# 

# \## Never edit

# 

# \- `backend/models/base\_model.py`

# \- Anything under `backend/models/group\_\*/`

# \- `.github/workflows/ci.yml`

# 

# If a group's model is broken, the fix is a comment in the registry or a PR

# comment to that group. Never an edit to their folder.

# 

# \## Hard rules

# 

# \*\*No AutoML, no recommendations.\*\* The UI never suggests a model, ranks models,

# or implies one is better for the data. It filters by compatibility only:

# incompatible models are shown but disabled. This applies to code, comments,

# variable names, and every string the user sees.

# 

# \*\*Preprocessing is backend-owned.\*\* Impute → encode → scale → cast to float64,

# all in `app/core/preprocessing.py`. Every fit is on the training split only.

# Models receive identical clean arrays and preprocess nothing.

# 

# \*\*`model\_type` is a switch, not documentation.\*\* Four values: `classifier`,

# `clusterer`, `regressor`, `dimensionality\_reducer`. It routes metric

# computation and result rendering. All four paths must work.

# 

# \*\*Known contract exceptions\*\* — handle explicitly, do not assume uniformity:

# \- `dimensionality\_reducer.predict` returns 2D `(n\_samples, n\_components)`,

# &#x20; not 1D. Code that assumes 1D predict output is wrong.

# \- Clusterers return `-1` for noise. Never relabel or drop it.

# \- `predict\_proba` returns `None` for everything except classifiers.

# \- Clusterers and reducers are fitted with `y=None`.

# 

# \*\*Determinism.\*\* `random\_state=42` everywhere. Identical input, identical output.

# 

# \## Commands

# 

# ```bash

# cd backend \&\& uvicorn app.main:app --reload    # run API (localhost:8000)

# cd backend \&\& pytest --cov=app --cov-report=term-missing

# cd backend \&\& ruff check .

# cd frontend \&\& npm run dev

# cd frontend \&\& npm run test

# ```

# 

# \## Working style

# 

# Plan before writing code on anything touching the API contract or the metrics

# switch — show the plan, wait for confirmation.

# 

# Explicit failure over silent fallback. Raise a specific exception with a

# message naming what went wrong. Never return `None` or an empty array to

# signal an error, and never swallow one.

# 

# Ask when the contract is genuinely ambiguous rather than picking a reading.

# The cost of a wrong guess here is twelve models built against it.

