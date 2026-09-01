import type { ReactNode } from "react";
import { Logo } from "./Logo";
import { StepIndicator } from "./StepIndicator";
import type { StepId, View } from "../types/steps";

interface StepShellProps {
  view: View;
  maxStepIndexReached: number;
  onNavigateToStep: (index: number) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  renderStart: () => ReactNode;
  renderStep: (step: StepId) => ReactNode;
}

/**
 * Persistent application shell:
 * - Sticky header
 * - Scrollable page content
 * - Fixed bottom navigation
 * - Back and Continue remain accessible while scrolling
 * - Continue is highlighted only when forward navigation is available
 */
export function StepShell({
  view,
  maxStepIndexReached,
  onNavigateToStep,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  renderStart,
  renderStep,
}: StepShellProps) {
  const isStart = view === "start";

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      {/* Header */}
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-4 border-b border-black/20 bg-brand-navy px-4">
        <StepIndicator
          currentStep={isStart ? null : view}
          maxStepIndexReached={isStart ? -1 : maxStepIndexReached}
          onNavigate={onNavigateToStep}
        />

        <Logo variant="mark" className="h-9 w-9" />
      </header>

      {/* Main content
          Extra bottom padding prevents content from being hidden
          underneath the fixed navigation bar. */}
      <main className="flex-1 px-4 py-8 pb-24">
        {isStart ? renderStart() : renderStep(view)}
      </main>

      {/* Fixed bottom navigation */}
      {!isStart && (
        <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-between border-t border-rule bg-surface/95 px-4 py-3 shadow-sm backdrop-blur">
          
          {/* Back */}
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack}
            className="
              cursor-pointer
              rounded-panel
              border
              border-rule
              px-4
              py-2
              text-sm
              text-ink
              transition-colors
              hover:bg-ground
              disabled:cursor-not-allowed
              disabled:text-muted
              disabled:opacity-50
            "
          >
            Back
          </button>

          {/* Continue */}
          <button
            type="button"
            onClick={onForward}
            disabled={!canGoForward}
            className={`rounded-panel border px-5 py-2 text-sm font-medium transition-colors ${
              canGoForward
                ? "cursor-pointer border-signal bg-signal text-surface hover:opacity-90"
                : "cursor-not-allowed border-rule bg-ground text-muted opacity-60"
            }`}
          >
            Continue
          </button>
        </nav>
      )}
    </div>
  );
}