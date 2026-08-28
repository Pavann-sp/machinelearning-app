import { Fragment } from "react";
import { ScreenPanel } from "../ScreenPanel";
import { SplitSlider } from "../SplitSlider";
import type { useTraining } from "../../hooks/useTraining";
import type { components } from "../../types/api";

type ModelSummary = components["schemas"]["ModelSummary"];
type TrainedModelResponse = components["schemas"]["TrainedModelResponse"];

interface TrainingScreenProps {
  dataId: string;
  models: ModelSummary[] | null;
  selectedModelKeys: string[];
  testSize: number;
  onTestSizeChange: (testSize: number) => void;
  trainingState: ReturnType<typeof useTraining>;
}

/** Screen 4 (frontend.md): selected models listed, split confirmation, one
 * primary action. Training is synchronous (ARCHITECTURE.md SS6) -- the rows
 * below move from pending to done together when the single response lands,
 * never a polling UI. Results render raw here; screen 5 (Session 7) gives
 * them the real per-type rendering. */
export function TrainingScreen({
  dataId,
  models,
  selectedModelKeys,
  testSize,
  onTestSizeChange,
  trainingState,
}: TrainingScreenProps) {
  const { results, loading, error, train } = trainingState;
  const selectedModels = (models ?? []).filter((m) => selectedModelKeys.includes(m.key));

  if (selectedModels.length === 0) {
    return (
      <ScreenPanel>
        <p className="text-sm text-muted">Select at least one model to continue.</p>
      </ScreenPanel>
    );
  }

  const handleTrain = () => {
    train({
      dataId,
      models: selectedModelKeys.map((key) => ({ model_key: key, hyperparameters: {} })),
      testSize,
    });
  };

  return (
    <ScreenPanel>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-lg font-medium text-ink">Training</h1>
          <p className="mt-1 text-sm text-muted">
            {selectedModels.length} model{selectedModels.length === 1 ? "" : "s"} selected.
          </p>
        </div>

        <div className="rounded-panel border border-rule p-4">
          <SplitSlider testSize={testSize} onChange={onTestSizeChange} disabled={loading} />
        </div>

        <ul className="flex flex-col gap-2">
          {selectedModels.map((model) => {
            const result = results?.results.find((r) => r.model_key === model.key);
            const status = loading ? "training" : result ? "done" : "pending";
            return (
              <li
                key={model.key}
                className="flex items-center justify-between rounded-panel border border-rule px-4 py-2 text-sm"
              >
                <span className="text-ink">{model.model_name}</span>
                <span
                  className={
                    "font-mono text-xs uppercase " + (status === "done" ? "text-signal" : "text-muted")
                  }
                >
                  {status}
                </span>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={handleTrain}
          disabled={loading}
          className="rounded-panel border border-signal bg-signal px-4 py-2 text-sm font-medium text-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Training…" : "Train selected models"}
        </button>

        {error && <p className="text-sm text-ink">Training failed: {error.message}</p>}

        {results && (
          <div className="mt-2 flex flex-col gap-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Results</h2>
            {results.results.map((result) => (
              <RawResultCard key={result.model_key} result={result} />
            ))}
          </div>
        )}
      </div>
    </ScreenPanel>
  );
}

function formatMetricValue(value: unknown): string {
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(4);
  return JSON.stringify(value);
}

function RawResultCard({ result }: { result: TrainedModelResponse }) {
  return (
    <div className="rounded-panel border border-rule bg-surface p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-ink">{result.model_name}</h3>
        <span className="font-mono text-xs uppercase text-muted">{result.model_type}</span>
      </div>

      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-xs">
        {Object.entries(result.metrics).map(([key, value]) => (
          <Row key={key} label={key} value={formatMetricValue(value)} />
        ))}
        {result.training_time_seconds != null && (
          <Row label="training_time_seconds" value={result.training_time_seconds.toFixed(3)} />
        )}
        <Row label="n_features" value={String(result.n_features)} />
      </dl>

      {result.feature_importance && (
        <div className="mt-2">
          <p className="text-xs uppercase tracking-wide text-muted">Feature importance</p>
          <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-xs">
            {Object.entries(result.feature_importance).map(([key, value]) => (
              <Row key={key} label={key} value={value.toFixed(4)} />
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Fragment>
      <dt className="text-muted">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </Fragment>
  );
}
