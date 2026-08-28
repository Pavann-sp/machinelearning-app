// The seven screens — frontend.md's layout contract.
export type StepId =
  | "upload"
  | "eda"
  | "model-selection"
  | "training"
  | "results"
  | "predict"
  | "compare";

export interface StepDefinition {
  id: StepId;
  label: string;
}

export const STEPS: StepDefinition[] = [
  { id: "upload", label: "Upload" },
  { id: "eda", label: "EDA" },
  { id: "model-selection", label: "Model selection" },
  { id: "training", label: "Training" },
  { id: "results", label: "Results" },
  { id: "predict", label: "Predict" },
  { id: "compare", label: "Compare" },
];
