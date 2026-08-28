import type { ReactNode } from "react";
import { StepShell } from "./components/StepShell";
import { useModels } from "./hooks/useModels";
import type { StepId } from "./types/steps";

function ScreenPanel({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-[640px] rounded-panel border border-rule bg-surface p-6 text-ink">
      {children}
    </section>
  );
}

// Screens 1-7 land in Sessions 6-7. This placeholder doubles as the round
// trip proof for Session 5: a real fetch through the typed client against
// the running backend's model registry.
function UploadPlaceholder() {
  const { models, loading, error } = useModels();

  return (
    <ScreenPanel>
      <h1 className="text-lg font-medium">Upload</h1>
      <p className="mt-1 text-sm text-muted">
        Screen lands in Session 6. This confirms the typed client reaches the
        running backend.
      </p>
      <p className="mt-4 font-mono text-sm">
        {loading && "Loading model registry…"}
        {error && `Registry request failed: ${error.message}`}
        {models && `${models.length} models registered.`}
      </p>
    </ScreenPanel>
  );
}

const PLACEHOLDER_LABELS: Record<Exclude<StepId, "upload">, string> = {
  eda: "EDA",
  "model-selection": "Model selection",
  training: "Training",
  results: "Results",
  predict: "Predict on new data",
  compare: "Compare",
};

function StepPlaceholder({ step }: { step: Exclude<StepId, "upload"> }) {
  return (
    <ScreenPanel>
      <h1 className="text-lg font-medium">{PLACEHOLDER_LABELS[step]}</h1>
      <p className="mt-1 text-sm text-muted">Screen lands in a later session.</p>
    </ScreenPanel>
  );
}

function App() {
  return (
    <StepShell
      renderStep={(step) =>
        step === "upload" ? <UploadPlaceholder /> : <StepPlaceholder step={step} />
      }
    />
  );
}

export default App;
