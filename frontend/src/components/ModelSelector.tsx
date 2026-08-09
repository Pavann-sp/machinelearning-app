const models = [
  "Decision Trees",
  "Random Forest & XGBoost",
  "RNN",
  "ANN",
  "KNN / K-Means / GMM",
  "Regression",
  "CNN",
  "HMM / Naive Bayes",
  "DBSCAN / Hierarchical",
  "LDA / QDA",
  "SVM",
  "PCA",
];

function ModelSelector() {
  return (
    <div className="section">
      <label htmlFor="model">Select Model</label>

      <select id="model" defaultValue="">
        <option value="" disabled>
          Select a model
        </option>

        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ModelSelector;