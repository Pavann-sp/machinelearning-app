

/

ML Project



Beta

ML Project















Recents

Building app with Claude code chat

17 minutes ago

Research paper report format and length requirements

Aug 12

PR merge readiness and backend preparation

Aug 11

Building wireframes with Claude Design

Jul 20

Project task breakdown and tracking

Jul 20

Upcoming PR preparation

Are we ready for recieving PRs after this or is there anything else to be done?

Jul 28

Instructions

Add instructions to tailor Claude’s responses



Memory

Only you

Purpose \& context Likith is the integration team lead (Group 16) and product owner on a university ML platform project (PES University, MBA Trimester 3, course UM25MB653CA2). His team of four — Ketaki Chakraborty, Lakshmidevi N G, Likith S Gowda, and Vinayak Dhongadi — is responsible for building a unified backend platform that aggregates and evaluates ML model submissions from 12 student groups, plus QA and DevOps. Likith also owns system-level architectural decisions and documentation consistency across the project. The platform aggregates 12 interchangeable ML models across four types (classifier, clusterer, regressor, dimensionality reducer), submitted via pull requests by student groups. The backend is FastAPI; the frontend is React + Vite + TypeScript + Tailwind CSS + Recharts. The UI follows a fixed 7-screen linear flow: CSV upload → EDA → model selection → training → results → predict on new data or compare models. AutoML-style language and model recommendations are explicitly prohibited — the UI only filters by compatibility. Key collaborators beyond Group 16: 12 submitting groups and 3 dedicated testing groups (Groups 10, 12, 14). Core architecture is locked and documented across ARCHITECTURE.md, DATAFLOWGUIDE.md, CODINGSTANDARDS.md, and related files. --- Current state FINAL submission deadlines (supersede all earlier tables in CODINGSTANDARDS.md, ARCHITECTURE.md, and PROJECTSEEDCONTEXT.md): Fri 14 Aug 2026 — Batch 1: Groups 1, 2, 3, 4, 5, 6 (Decision Trees, RF+XGBoost, RNN/LSTM/GRU, ANN, KNN/K-Means/GMM, Regression) Fri 21 Aug 2026 — Batch 2: Groups 7, 8, 9, 11, 13, 15 (CNN, HMM/Naïve Bayes, DBSCAN/Hierarchical, LDA \& QDA, SVM, PCA) Fri 28 Aug 2026 — Batch 3: Groups 10, 12, 14 (testing teams) FINAL testing assignments (supersede the conflicting tables in CODINGSTANDARDS.md §16 and ARCHITECTURE.md §10 — both are currently wrong): Group 14: Decision Trees, KNN/K-Means/GMM, CNN, PCA Group 10: RF+XGBoost, RNN/LSTM/GRU, DBSCAN/Hierarchical, HMM/Naïve Bayes Group 12: ANN, Regression, LDA \& QDA, SVM Active work includes: The validator (validatesubmission.py) is incomplete and only partially enforces what CODINGSTANDARDS.md promises — this is the immediate critical-path priority given Batch 1 is imminent The logistic regression reference implementation should be completed fully; it serves as an executable test fixture for the validator Private conformance fixtures (covering all four model types) should live in the backend test directory, inaccessible to students, to avoid doing assigned work for them The backend does not need to be fully complete before merging PRs, but a thin vertical slice (preprocessing, minimal registry, one working train endpoint) should be ready before Batch 1 arrives to verify the published data contract is satisfiable Sample dataset fallback for demo flow: ship scikit-learn built-in datasets via backend/app/core/samples.py with two endpoints (GET /api/data/samples, POST /api/data/samples/{id}), plus a synthetic sequence generator reusing validator fixture infrastructure. Student groups should not supply their own datasets. Model report template (MODELREPORTTEMPLATE.pdf) has been generated using ReportLab (Times New Roman 12pt, matching university format). Reports are submitted to LMS as PDFs (GroupNN<Model>Report.pdf) — not committed to the repo or included in PRs. Word target: \~1,000 words plus \~400 per additional algorithm for multi-algorithm groups, excluding abstract, references, tables, and equations. READMEs (covering usage, hyperparameter table, test commands, feature layout) remain in the repo separately. Wireframes are a blocking predecessor to all frontend component work; they function as a layout contract between Likith and the React developers. Open decisions requiring Likith's call: DBSCAN/Hierarchical predict contract for Group 9 (no native predict-on-unseen capability) validatesubmission.py fixture path inconsistency between docstring and loader PCA metadata §7 correction in CODINGSTANDARDS.md PCA's two-dimensional predict output conflicts with the one-dimensional assumption in the validator (would incorrectly fail a correct submission) Whether to establish a frontend design system before wireframes or proceed directly to wireframes (frontend directory is currently an empty placeholder) Documents needing updates: CODINGSTANDARDS.md §16 and ARCHITECTURE.md §10 both contain stale/wrong testing group assignment tables All prior date references throughout project documents are stale and should be replaced with the final schedule above Note: Groups 3 (RNN) and 4 (ANN) are PyTorch groups now in Batch 1, which inverts sequencing rationale previously written into the standards doc --- On the horizon DECISIONS.md ADR (Architecture Decision Records) log: proposed to consolidate \~15 already-locked system-level decisions currently scattered across six documents, with each entry capturing context, decision, rationale, consequences, and status. Value depends on Likith committing to landing all future locked decisions there. Wireframe brief (wireframe-brief-for-claude-design.md) covering 7 screens with component-level specs has been drafted; next step is working through Claude Design with ARCHITECTURE.md and DATAFLOWGUIDE.md uploaded (omitting CODINGSTANDARDS.md, GITCLIGUIDE.md, EXPLAINERFORLIKITH.md, and seed context doc). CI pipeline verification: whether CI has ever run successfully is currently unverified. Collaborator repository permissions and whether the scaffold is actually pushed to the repo are also unverified. --- Key learnings \& principles Several items marked "done" in project context are actually unverified — distinguish confirmed done from claimed-but-unverified before treating them as complete. The validator is the trust anchor for the entire submission pipeline; its incompleteness is a higher risk than backend incompleteness. Pretrained/serialized models are the wrong approach for the demo fallback: serialization complexity, checkpoint sizes, new UI branching, and no meaningful time saving given the five-minute training ceiling all argue against it. The report template separates reasoning (report/PDF) from operational detail (README/repo) — this distinction should be preserved. System-level architectural decisions should have a single addressable home (DECISIONS.md); scattering them across six documents creates consistency risk. UI must never recommend models or use AutoML language — compatibility filtering only. --- Approach \& patterns Likith prefers to review decompositions and challenge them before committing anything to a file. Architecture and standards are locked documents; changes require deliberate decision rather than drift. Student groups own their model implementations; the integration team owns preprocessing, the registry, the API contract, and the evaluation pipeline. Giving students public conformance examples risks doing their assigned work. Document consistency is an ongoing operational concern — any schedule or assignment change must propagate to all affected documents explicitly. --- Tools \& resources Backend: FastAPI, scikit-learn, PyTorch (Groups 3 and 4) Frontend: React + Vite + TypeScript + Tailwind CSS + Recharts Report generation: ReportLab (PDF, Times New Roman 12pt) Wireframing: Claude Design (claude.com/product/design), Pro/Max/Team/Enterprise plans LMS: used for PDF report submission Key documents: ARCHITECTURE.md, DATAFLOWGUIDE.md, CODINGSTANDARDS.md, GITCLIGUIDE.md, EXPLAINERFORLIKITH.md, PROJECTSEED\_CONTEXT.md



Last updated Aug 13



Context

1% of project capacity used



ARCHITECTURE.md

230 lines



md









CODING\_STANDARDS.md

535 lines



md









DATA\_FLOW\_GUIDE.md

154 lines



md









GIT\_CLI\_GUIDE.md

243 lines



md









EXPLAINER\_FOR\_LIKITH.md

114 lines



md









PROJECT\_SEED\_CONTEXT.md

117 lines



md







Scheduled

Set up recurring tasks for this project.



DATA\_FLOW\_GUIDE.md





Data Flow Guide — from upload to prediction

Audience: the integration team, and anyone you're walking through the system. Purpose: trace exactly what happens to a dataset from the moment a user uploads it to the moment they see a result — what gets converted, what gets handed to a model, what comes back, and what we do with it.



Read this alongside ARCHITECTURE.md (the full stack) and CODING\_STANDARDS.md (what the 12 groups must produce). This document is the thread connecting them: it explains the conversions in between.



1\. The one-sentence version

We convert whatever the user uploads into one fixed shape before any model sees it, and we convert whatever a model returns into one fixed shape before the user sees it. Both conversions happen in the backend. Models never see raw data, and the frontend never sees raw model output.



Everything below is the detail behind that sentence.



2\. Stage 1 — Upload → raw table

Input: a CSV file from the user, arbitrary columns, arbitrary types.



What we do:



Parse the CSV into a pandas DataFrame.

Reject the upload if it fails basic sanity checks: wrong format, fewer than 50 rows, more than 100 columns, no numeric columns at all.

Identify the target column — either named by the user, or defaulted to the last column.

Infer a data type for the problem itself:

target is categorical with 2–10 unique values → classification

target is continuous (more than 10 unique values) → regression

no target given → clustering

Output of this stage: a raw DataFrame plus a data\_type label. Nothing has been cleaned yet. This is what powers the EDA screen — summary statistics, missing-value counts, distribution charts — computed directly on the raw table so the user sees their data as it actually is before we touch it.



3\. Stage 2 — Raw table → model-ready array

This is the conversion every model depends on, and it is the one place in the whole system where "input format" gets decided once, for everyone.



What we do, in order:



Split. Train/test split at the ratio the user chose (default 80/20), stratified for classification so class proportions are preserved in both halves.

Impute. Missing values filled — numeric columns with the median, categorical columns with the mode. The imputer is fit on the training split only.

Encode. Categorical columns converted to numeric (label or one-hot, depending on cardinality). Same rule: fit on train, apply to test.

Scale. Numeric columns standardized (zero mean, unit variance) with a scaler fit on the training split only.

Cast. The result converted to a numpy array, dtype float64.

Why fit-on-train-only matters: if we fit the scaler or encoder on the combined train+test data, information from the test set leaks into training indirectly (the model "knows" the test set's distribution before it's evaluated). That inflates every metric we report and is exactly the mistake the coding standards forbid group models from making internally — we don't make it either, at the layer above them.



Output of this stage: X\_train, X\_test — both 2D float64 numpy arrays, same number of columns, no missing values, fully numeric, scaled. y\_train, y\_test as 1D arrays (or None for clustering).



This is exactly the object every one of the 12 models receives. Nothing upstream of this point is model-specific. Nothing downstream of this point touches raw data again.



4\. Stage 3 — Handing data to a model

The user has picked one or more models from the (compatibility-filtered) list. For each:



Look up the class in the registry (app/core/registry.py).

Instantiate it, passing any hyperparameter overrides the user supplied (JSON-safe types only — see the coding standards).

Call model.fit(X\_train, y\_train).

Call model.predict(X\_test) and, if the model is a classifier, model.predict\_proba(X\_test).

Call model.get\_metadata() and, if present, model.get\_visualization\_data().

Every model receives the identical X\_train/X\_test produced in Stage 2. We never branch this step by algorithm family — the whole point of the BaseModel contract is that this code doesn't know or care whether it's calling K-Means or an RNN.



The one exception: sequence and image groups (RNN, CNN) receive the same 2D array but reshape it internally, according to the column layout they document in their own README. We don't reshape for them — we just guarantee the 2D array arrives clean, and trust their fit/predict to interpret it as they've documented.



5\. Stage 4 — Converting what comes back

A model hands us back three things, and each is used differently.



5.1 Predictions (predict, predict\_proba)

Raw output: a 1D array (labels, cluster ids, or floats) and, for classifiers, a probability matrix.



We convert this into the metrics the user actually sees, and which metrics we compute depends entirely on the model\_type string from get\_metadata():



model\_type	Metrics computed from predictions

classifier	accuracy, precision, recall, F1, confusion matrix

clusterer	silhouette score, Davies–Bouldin index, inertia

regressor	MSE, RMSE, R², MAE

dimensionality\_reducer	explained variance ratio

This is why the metadata contract is strict — model\_type is not documentation, it's a switch statement. Get it wrong and the backend computes the wrong metrics, or crashes trying to compute a confusion matrix on continuous output.



5.2 Metadata (get\_metadata)

Used two ways:



Display — model name, hyperparameters, training time shown in the results view.

Routing — model\_type drives the metrics switch above; feature\_importance, if present, renders as a bar chart alongside the metrics.

5.3 Visualization data (get\_visualization\_data, optional)

Only present for groups 1, 2, 9, 15. Whatever JSON-safe structure they return is handed to a matching frontend chart component we build for that specific shape (SHAP bar chart, dendrogram, variance plot, tree diagram). This is the one place output format is not uniform across models — by design, since these are genuinely different visual artifacts. Everything else in this document is about forcing uniformity; this is the deliberate exception.



6\. Stage 5 — Class imbalance note

Computed once, right after Stage 1 (on the raw target column, classification datasets only): if any class is below 20% or above 80% of samples, the EDA response carries a flag, and the frontend shows an informational line — never a blocker, never shown again after that first screen.



This sits outside the model pipeline entirely. Models never see this flag and never adjust their behavior because of it.



7\. Stage 6 — Prediction on new data

When a user later uploads a fresh CSV to get predictions from an already-trained model, it goes through the same Stage 2 conversion — impute, encode, scale — but using the encoder/scaler objects already fit during that model's original training, not refit on the new data. Then straight to model.predict(). Same contract, same shape guarantees, just skipping the fit step.



If the new file's columns don't match what the model was trained on, we reject it before it reaches the model, with a clear message naming the mismatch — this is caught in Stage 2, not left for the model to discover.



8\. The whole path, in one picture

CSV upload

&#x20;  │

&#x20;  ▼

raw DataFrame  ──────────────►  EDA view (stats, charts, imbalance note)

&#x20;  │

&#x20;  ▼

\[Stage 2: split → impute → encode → scale → cast to float64]

&#x20;  │

&#x20;  ▼

X\_train, X\_test, y\_train, y\_test   (identical shape for every model)

&#x20;  │

&#x20;  ▼

model.fit(X\_train, y\_train)

model.predict(X\_test) / predict\_proba(X\_test)

model.get\_metadata()

model.get\_visualization\_data()   (optional)

&#x20;  │

&#x20;  ▼

\[Stage 4: route by model\_type → compute the right metrics]

&#x20;  │

&#x20;  ▼

results view: metrics, confusion matrix / distribution / comparison bars,

&#x20;             any model-specific chart

&#x20;  │

&#x20;  ▼

user chooses: predict on new data (→ Stage 6)  or  compare models

9\. What this buys us

Every conversion above exists to answer one question the same way, regardless of which of the 12 algorithms is running: what does a model receive, and what must it return? Because that's fixed once, in the backend, the 12 groups never see each other's code and never need to agree on anything among themselves — they only need to agree with this document and with CODING\_STANDARDS.md. If a model's results look wrong, the first question is always "which stage produced this," not "whose code is broken" — Stage 2 is shared infrastructure, Stage 3 is the model's own logic, Stage 4 is shared infrastructure again. That's usually enough to localize a bug before opening a single line of a group's model.





