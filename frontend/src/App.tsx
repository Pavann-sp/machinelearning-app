import { useCallback, useEffect, useState } from "react";
import { ScreenPanel } from "./components/ScreenPanel";
import { StepShell } from "./components/StepShell";
import { EdaScreen } from "./components/screens/EdaScreen";
import { ModelSelectionScreen } from "./components/screens/ModelSelectionScreen";
import { TrainingScreen } from "./components/screens/TrainingScreen";
import { UploadScreen } from "./components/screens/UploadScreen";
import { useModels } from "./hooks/useModels";
import { useTraining } from "./hooks/useTraining";
import type { DataProfileResponse } from "./hooks/useDataset";
import type { StepId } from "./types/steps";

const DEFAULT_TEST_SIZE = 0.2;

const PLACEHOLDER_LABELS: Record<"results" | "predict" | "compare", string> = {
  results: "Results",
  predict: "Predict on new data",
  compare: "Compare",
};

function StepPlaceholder({ step }: { step: "results" | "predict" | "compare" }) {
  return (
    <ScreenPanel>
      <h1 className="text-lg font-medium text-ink">{PLACEHOLDER_LABELS[step]}</h1>
      <p className="mt-1 text-sm text-muted">Screen lands in Session 7.</p>
    </ScreenPanel>
  );
}

function NoDatasetNotice() {
  return (
    <ScreenPanel>
      <p className="text-sm text-muted">Upload a dataset or load a sample first.</p>
    </ScreenPanel>
  );
}

function App() {
  const [profile, setProfile] = useState<DataProfileResponse | null>(null);
  const [testSize, setTestSize] = useState(DEFAULT_TEST_SIZE);
  const [selectedModelKeys, setSelectedModelKeys] = useState<string[]>([]);

  const modelsState = useModels();
  const trainingState = useTraining();
  const { checkCompatibility } = modelsState;
  const { reset: resetTraining } = trainingState;

  const handleProfile = useCallback((next: DataProfileResponse) => {
    setProfile(next);
  }, []);

  // A new dataset invalidates any selection and training run made against
  // the previous one, and needs its own compatibility check.
  useEffect(() => {
    if (!profile) return;
    setSelectedModelKeys([]);
    resetTraining();
    checkCompatibility(profile.data_id);
  }, [profile, checkCompatibility, resetTraining]);

  const toggleModel = useCallback(
    (key: string) => {
      setSelectedModelKeys((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
      );
      // The prior run no longer matches the selection it would be shown against.
      resetTraining();
    },
    [resetTraining],
  );

  const isStepComplete: Partial<Record<StepId, boolean>> = {
    upload: profile !== null,
    eda: profile !== null,
    "model-selection": selectedModelKeys.length > 0,
    training: trainingState.results !== null,
  };

  return (
    <StepShell
      isStepComplete={isStepComplete}
      renderStep={(step) => {
        switch (step) {
          case "upload":
            return (
              <UploadScreen
                profile={profile}
                onProfile={handleProfile}
                testSize={testSize}
                onTestSizeChange={setTestSize}
              />
            );
          case "eda":
            return profile ? <EdaScreen profile={profile} /> : <NoDatasetNotice />;
          case "model-selection":
            return profile ? (
              <ModelSelectionScreen
                models={modelsState.models}
                compatibility={modelsState.compatibility}
                loading={modelsState.loading}
                error={modelsState.error}
                selected={selectedModelKeys}
                onToggle={toggleModel}
              />
            ) : (
              <NoDatasetNotice />
            );
          case "training":
            return profile ? (
              <TrainingScreen
                dataId={profile.data_id}
                models={modelsState.models}
                selectedModelKeys={selectedModelKeys}
                testSize={testSize}
                onTestSizeChange={setTestSize}
                trainingState={trainingState}
              />
            ) : (
              <NoDatasetNotice />
            );
          default:
            return <StepPlaceholder step={step} />;
        }
      }}
    />
  );
}

export default App;
