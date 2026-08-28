import { STEPS, type StepId } from "../types/steps";

interface StepIndicatorProps {
  currentStep: StepId;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <ol
      aria-label="Progress"
      className="flex w-full items-center gap-2 overflow-x-auto border-b border-rule bg-surface px-4 py-3 font-mono text-xs tracking-wide uppercase"
    >
      {STEPS.map((step, index) => {
        const isCurrent = step.id === currentStep;
        const isComplete = index < currentIndex;
        return (
          <li key={step.id} className="flex shrink-0 items-center gap-2">
            <span
              aria-current={isCurrent ? "step" : undefined}
              className={
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-panel border " +
                (isCurrent
                  ? "border-signal text-signal"
                  : isComplete
                    ? "border-ink text-ink"
                    : "border-rule text-muted")
              }
            >
              {index + 1}
            </span>
            <span className={isCurrent ? "text-ink" : "text-muted"}>{step.label}</span>
            {index < STEPS.length - 1 && (
              <span aria-hidden="true" className="mx-1 h-px w-6 bg-rule" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
