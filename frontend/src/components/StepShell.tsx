import { useState, type ReactNode } from "react";
import { StepIndicator } from "./StepIndicator";
import { STEPS, type StepId } from "../types/steps";

interface StepShellProps {
  // Session 6/7 screens report their own completion; until then every step
  // is left ungated so the shell is exercisable end to end.
  isStepComplete?: Partial<Record<StepId, boolean>>;
  renderStep: (step: StepId) => ReactNode;
}

/**
 * Linear flow, one screen per step, persistent step indicator, back always
 * available, forward gated on the current step completing — frontend.md.
 */
export function StepShell({ isStepComplete = {}, renderStep }: StepShellProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStep = STEPS[currentIndex].id;

  const canGoBack = currentIndex > 0;
  const currentComplete = isStepComplete[currentStep] ?? true;
  const canGoForward = currentIndex < STEPS.length - 1 && currentComplete;

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      <StepIndicator currentStep={currentStep} />
      <main className="flex-1 px-4 py-8">{renderStep(currentStep)}</main>
      <nav className="flex justify-between border-t border-rule bg-surface px-4 py-3">
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={!canGoBack}
          className="rounded-panel border border-rule px-4 py-2 text-sm text-ink disabled:cursor-not-allowed disabled:text-muted disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.min(STEPS.length - 1, i + 1))}
          disabled={!canGoForward}
          className="rounded-panel border border-signal px-4 py-2 text-sm text-signal disabled:cursor-not-allowed disabled:border-rule disabled:text-muted disabled:opacity-50"
        >
          Continue
        </button>
      </nav>
    </div>
  );
}
