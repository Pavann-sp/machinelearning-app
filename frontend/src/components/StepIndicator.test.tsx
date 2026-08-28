import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepIndicator } from "./StepIndicator";
import { STEPS } from "../types/steps";

describe("StepIndicator", () => {
  it("renders all seven steps", () => {
    render(<StepIndicator currentStep="upload" />);
    expect(screen.getAllByRole("listitem")).toHaveLength(7);
    for (const step of STEPS) {
      expect(screen.getByText(step.label)).toBeInTheDocument();
    }
  });

  it("marks the current step and only the current step", () => {
    const { container } = render(<StepIndicator currentStep="training" />);
    const current = container.querySelectorAll('[aria-current="step"]');
    expect(current).toHaveLength(1);
    // Training is the 4th step.
    expect(current[0]).toHaveTextContent("4");
  });
});
