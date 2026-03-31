import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";

// Mock next/navigation — notFound must throw to stop rendering
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// Mock next/link to render a plain <a>
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import ProjectPage from "../app/[slug]/page";
import { notFound } from "next/navigation";

async function renderProjectPage(slug: string) {
  const params = Promise.resolve({ slug });
  const Component = await ProjectPage({ params });
  render(Component);
}

describe("Project pages", () => {
  afterEach(cleanup);

  describe("maconfai", () => {
    it("renders the project name and tagline", async () => {
      await renderProjectPage("maconfai");
      expect(screen.getByText("maconfai")).toBeInTheDocument();
      expect(
        screen.getByText("Partagez vos configurations AI en un instant")
      ).toBeInTheDocument();
    });

    it("displays the installation command", async () => {
      await renderProjectPage("maconfai");
      expect(screen.getByText("pip install maconfai")).toBeInTheDocument();
    });

    it("displays features", async () => {
      await renderProjectPage("maconfai");
      expect(
        screen.getByText(/Import\/export de configurations/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Registry communautaire/)
      ).toBeInTheDocument();
    });

    it("has a link back to homepage", async () => {
      await renderProjectPage("maconfai");
      const backLinks = screen.getAllByRole("link", { name: /retour/i });
      expect(backLinks.length).toBeGreaterThan(0);
      expect(backLinks[0]).toHaveAttribute("href", "/");
    });

    it("has a GitHub link to the repo", async () => {
      await renderProjectPage("maconfai");
      const allLinks = screen.getAllByRole("link");
      const repoLink = allLinks.find(
        (l) => l.getAttribute("href") === "https://github.com/vbarrai/maconfai"
      );
      expect(repoLink).toBeDefined();
    });
  });

  describe("parcai", () => {
    it("renders the project name and tagline", async () => {
      await renderProjectPage("parcai");
      expect(screen.getByText("parcai")).toBeInTheDocument();
      expect(
        screen.getByText(/Votre agent AI, en toute sécurité/)
      ).toBeInTheDocument();
    });

    it("displays the installation command", async () => {
      await renderProjectPage("parcai");
      expect(screen.getByText("brew install vbarrai/tap/parcai")).toBeInTheDocument();
    });

    it("displays features", async () => {
      await renderProjectPage("parcai");
      expect(
        screen.getByText(/Sandbox complet pour Claude Code/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Protection contre l'exfiltration/)
      ).toBeInTheDocument();
    });

    it("has a GitHub link to the repo", async () => {
      await renderProjectPage("parcai");
      const allLinks = screen.getAllByRole("link");
      const repoLink = allLinks.find(
        (l) => l.getAttribute("href") === "https://github.com/vbarrai/parcai"
      );
      expect(repoLink).toBeDefined();
    });
  });

  describe("murmurai", () => {
    it("renders the project name and tagline", async () => {
      await renderProjectPage("murmurai");
      expect(screen.getByText("murmurai")).toBeInTheDocument();
      expect(
        screen.getByText(/Parlez à votre agent, ne tapez plus/)
      ).toBeInTheDocument();
    });

    it("displays the installation command", async () => {
      await renderProjectPage("murmurai");
      expect(screen.getByText("brew install --cask vbarrai/tap/murmurai")).toBeInTheDocument();
    });

    it("displays features", async () => {
      await renderProjectPage("murmurai");
      expect(
        screen.getByText(/Reconnaissance vocale en temps réel/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Support multilingue/)
      ).toBeInTheDocument();
    });

    it("has a GitHub link to the repo", async () => {
      await renderProjectPage("murmurai");
      const allLinks = screen.getAllByRole("link");
      const repoLink = allLinks.find(
        (l) =>
          l.getAttribute("href") === "https://github.com/vbarrai/murmurai"
      );
      expect(repoLink).toBeDefined();
    });
  });

  describe("unknown project", () => {
    it("calls notFound for an unknown slug", async () => {
      const params = Promise.resolve({ slug: "unknown-project" });
      await expect(ProjectPage({ params })).rejects.toThrow("NEXT_NOT_FOUND");
      expect(notFound).toHaveBeenCalled();
    });
  });
});
