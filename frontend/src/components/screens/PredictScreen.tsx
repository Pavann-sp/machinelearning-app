import { useState } from "react";
import { Dropzone } from "../Dropzone";
import { ScreenPanel } from "../ScreenPanel";
import { diffColumns, parseCsvHeader, type ColumnMismatch } from "../../lib/columns";
import { usePrediction } from "../../hooks/usePrediction";
import type { DataProfileResponse } from "../../hooks/useDataset";
import type { components } from "../../types/api";

type TrainResponse = components["schemas"]["TrainResponse"];

const MAX_ROWS_SHOWN = 25;

interface PredictScreenProps {
  profile: DataProfileResponse;
  trainingResults: TrainResponse | null;
}

/** Screen 6 (frontend.md): mirrors screen 1. On column mismatch, names the
 * mismatched columns explicitly before any request is sent -- the check
 * runs client-side against the columns this training run's dataset had
 * (minus the target, which a fresh prediction file never carries), ahead
 * of the backend's own rejection at Stage 6 (defense in depth, not a
 * replacement for it). */
export function PredictScreen({ profile, trainingResults }: PredictScreenProps) {
  const { result, loading, error, predict, reset } = usePrediction();
  const [modelKey, setModelKey] = useState(trainingResults?.results[0]?.model_key ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [mismatch, setMismatch] = useState<ColumnMismatch | null>(null);

  if (!trainingResults || trainingResults.results.length === 0) {
    return (
      <ScreenPanel>
        <p className="text-sm text-muted">Train at least one model before predicting on new data.</p>
      </ScreenPanel>
    );
  }

  const expectedColumns = profile.columns
    .filter((column) => column.name !== profile.target_column)
    .map((column) => column.name);

  const handleFile = async (nextFile: File) => {
    reset();
    setFile(nextFile);
    const header = parseCsvHeader(await nextFile.text());
    setMismatch(diffColumns(expectedColumns, header));
  };

  const handlePredict = () => {
    if (!file || mismatch) return;
    predict(trainingResults.training_id, modelKey, file);
  };

  return (
    <ScreenPanel maxWidthClassName="max-w-3xl">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-lg font-medium text-ink">Predict on new data</h1>
          <p className="mt-1 text-sm text-muted">
            Upload a CSV with the same feature columns as training to get predictions from a trained model.
          </p>
        </div>

        <div className="rounded-panel border border-rule p-4">
          <label className="text-sm text-muted" htmlFor="predict-model">
            Model
          </label>
          <select
            id="predict-model"
            className="mt-1 w-full rounded-panel border border-rule bg-surface px-3 py-2 text-sm text-ink"
            value={modelKey}
            onChange={(e) => {
              setModelKey(e.target.value);
              reset();
            }}
          >
            {trainingResults.results.map((r) => (
              <option key={r.model_key} value={r.model_key}>
                {r.model_name}
              </option>
            ))}
          </select>
        </div>

        <Dropzone onFile={handleFile} loading={loading} fileName={file?.name} />

        {mismatch && (
          <div className="rounded-panel border border-rule p-4 text-sm text-ink">
            <p className="font-medium">This file's columns don't match the training data.</p>
            {mismatch.missing.length > 0 && (
              <p className="mt-1 text-xs text-muted">
                Missing: <span className="font-mono text-ink">{mismatch.missing.join(", ")}</span>
              </p>
            )}
            {mismatch.unexpected.length > 0 && (
              <p className="mt-1 text-xs text-muted">
                Unexpected: <span className="font-mono text-ink">{mismatch.unexpected.join(", ")}</span>
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handlePredict}
          disabled={!file || !!mismatch || loading}
          className="rounded-panel border border-signal bg-signal px-4 py-2 text-sm font-medium text-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Predicting…" : "Predict"}
        </button>

        {error && <p className="text-sm text-ink">Prediction failed: {error.message}</p>}

        {result && <PredictionTable result={result} />}
      </div>
    </ScreenPanel>
  );
}

function formatPrediction(value: unknown): string {
  if (Array.isArray(value)) return value.map((v) => (typeof v === "number" ? v.toFixed(4) : String(v))).join(", ");
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(4);
  return String(value);
}

function PredictionTable({ result }: { result: components["schemas"]["PredictionResponse"] }) {
  const shown = result.predictions.slice(0, MAX_ROWS_SHOWN);

  return (
    <div>
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-muted">
        {result.n_samples} prediction{result.n_samples === 1 ? "" : "s"}
      </p>
      <div className="overflow-x-auto rounded-panel border border-rule bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-rule text-xs uppercase tracking-wide text-muted">
              <th className="px-3 py-2 font-medium">Row</th>
              <th className="px-3 py-2 font-medium">Prediction</th>
              {result.probabilities && <th className="px-3 py-2 font-medium">Probabilities</th>}
            </tr>
          </thead>
          <tbody>
            {shown.map((prediction, i) => (
              <tr key={i} className="border-b border-rule last:border-b-0">
                <td className="px-3 py-2 font-mono text-xs text-muted">{i}</td>
                <td className="px-3 py-2 font-mono text-ink">{formatPrediction(prediction)}</td>
                {result.probabilities && (
                  <td className="px-3 py-2 font-mono text-xs text-ink">
                    {result.probabilities[i].map((p) => p.toFixed(3)).join(", ")}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {result.n_samples > MAX_ROWS_SHOWN && (
        <p className="mt-1 font-mono text-xs text-muted">
          Showing first {MAX_ROWS_SHOWN} of {result.n_samples}.
        </p>
      )}
    </div>
  );
}
