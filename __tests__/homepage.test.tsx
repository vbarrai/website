import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";

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
  afterEach(cleanup);

  it("displays 'vbarrai' branding on the page", () => {
    render(<Home />);
    const elements = screen.getAllByText("vbarrai");
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0]).toBeInTheDocument();
  });

  describe("Navigation links", () => {
    it("contains navbar links for Projects, Tools, Community, and Docs", () => {
      render(<Home />);
      for (const label of ["Projects", "Tools", "Community", "Docs"]) {
        const links = screen.getAllByRole("link", { name: label });
        const navLink = links.find(
          (l) => l.getAttribute("href") === `#${label.toLowerCase()}`
        );
        expect(navLink).toBeDefined();
      }
    });

    it("contains a GitHub link pointing to the vbarrai org", () => {
      render(<Home />);
      const githubLinks = screen.getAllByRole("link", { name: /GitHub/i });
      const orgLink = githubLinks.find(
        (l) => l.getAttribute("href") === "https://github.com/vbarrai"
      );
      expect(orgLink).toBeDefined();
    });

    it("contains a link to the homepage via the logo", () => {
      render(<Home />);
      const logoLinks = screen.getAllByRole("link", { name: /vbarrai/i });
      const homeLink = logoLinks.find(
        (l) => l.getAttribute("href") === "/"
      );
      expect(homeLink).toBeDefined();
    });
  });

  describe("Project cards", () => {
    it("displays all three project cards with correct links", () => {
      render(<Home />);
      for (const name of ["maconfai", "parcai", "murmurai"]) {
        const links = screen.getAllByRole("link", { name: new RegExp(name) });
        const projectLink = links.find(
          (l) => l.getAttribute("href") === `/${name}`
        );
        expect(projectLink).toBeDefined();
      }
    });

    it("displays project descriptions", () => {
      render(<Home />);
      expect(screen.getAllByText(/Gestionnaire de skills minimal/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Isolation shell légère/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Transcription vocale push-to-talk/).length).toBeGreaterThan(0);
    });
  });
});
