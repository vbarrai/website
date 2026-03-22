import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock canvas for NeuralBackground
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  createRadialGradient: vi.fn().mockReturnValue({
    addColorStop: vi.fn(),
  }),
});

// Mock IntersectionObserver for StatsSection
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

import Home from "../app/page";

describe("Homepage", () => {
  it("displays 'vbarrai' branding on the page", () => {
    render(<Home />);
    const elements = screen.getAllByText("vbarrai");
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0]).toBeInTheDocument();
  });
});
