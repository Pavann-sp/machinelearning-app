# Build sessions

One Claude Code session per slice. `/clear` between them. Each session ends with
something runnable and tested; if it doesn't, don't start the next one.

Nothing here touches `backend/models/group_*/`.

---

## Session 1 — Reference models + conformance suite

Four throwaway models in `backend/tests/reference_models/`, forty lines each,
each subclassing `BaseModel` and satisfying `CODING_STANDARDS.md` §4/§7/§8:

| file | class | `model_type` |
|---|---|---|
| `ref_logistic.py` | `RefLogisticRegressionModel` | `classifier` |
| `ref_kmeans.py` | `RefKMeansModel` | `clusterer` |
| `ref_linear.py` | `RefLinearRegressionModel` | `regressor` |
| `ref_pca.py` | `RefPCAModel` | `dimensionality_reducer` |

These are deliberately not good models. They exist to exercise all four
branches of the metrics switch.

Then `backend/tests/test_conformance.py`, parametrised over the registry.
Assertions are listed in `.claude/rules/backend.md`.

**Done when:** conformance suite passes against all four, including PCA's 2D
predict output and K-Means' `y=None` path.

---

## Session 2 — Preprocessing, upload, EDA

`app/core/preprocessing.py`, `app/core/imbalance.py`, `app/core/samples.py`,
`app/routes/data.py`, matching Pydantic schemas.

Endpoints: `POST /api/data/upload`, `GET /api/data/{data_id}`,
`GET /api/data/samples`, `POST /api/data/samples/{id}`.

Sample datasets ship scikit-learn built-ins so the demo runs without a file.
Upload rejects: wrong format, <50 rows, >100 columns, no numeric columns.

**Done when:** a real CSV and a sample dataset both return an EDA payload with
the imbalance flag correct on a deliberately skewed target.

---

## Session 3 — Registry, compatibility, training

`app/core/registry.py` (manifest, reference models only),
`app/core/metrics.py`, `app/routes/models.py`, `app/routes/training.py`.

`POST /api/models/compatible` returns compatible and incompatible lists with a
reason per incompatible model. `POST /api/training/train` is synchronous.

**Done when:** all four reference models train through the API on an
appropriate dataset and return the right metric set for their type. A clusterer
requested on labelled data comes back as incompatible with a reason, not an error.

---

## Session 4 — Prediction and comparison

`app/routes/prediction.py`, `POST /api/results/comparison`.

Stage 6 reuses the fitted imputer/encoder/scaler from training. Column mismatch
is rejected before the model is called, naming the mismatched columns.

**Done when:** train → predict on a fresh CSV works, and a mismatched CSV fails
with a message a user could act on.

---

## Session 5 — Frontend scaffold

Vite + React + TS + Tailwind. Tokens from `.claude/rules/frontend.md` into the
Tailwind config. Types generated from the live OpenAPI schema at
`localhost:8000/openapi.json`, typed client in `src/api/`, `useModels` and
`useTraining` hooks, step shell with the seven-step indicator.

**Done when:** the shell renders, the client compiles against real backend
types, and one endpoint round-trips.

---

## Session 6 — Screens 1–4

Upload, EDA, model selection, training. Layout per the frontend rules.

**Done when:** a user can go upload → EDA → select → train and see raw results.

---

## Session 7 — Screens 5–7

Results, predict, compare. All four result renderings, not just the confusion
matrix — the clusterer, regressor and reducer panels are the ones most likely to
be skipped and most likely to break later.

**Done when:** all four reference models render correctly end to end.

---

## After

Register the twelve group models one batch at a time, running the conformance
suite after each. A failure at that point is theirs, not yours — which is the
entire reason for building in this order.
