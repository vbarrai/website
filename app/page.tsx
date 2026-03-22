import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import StatsSection from "./components/StatsSection";
import ProjectsSection from "./components/ProjectsSection";
import Footer from "./components/Footer";

const REPOS = ["maconfai", "parcai", "murmurai"];

async function fetchGitHubStats() {
  try {
    const results = await Promise.all(
      REPOS.map(async (repo) => {
        const [repoRes, contributorsRes] = await Promise.all([
          fetch(`https://api.github.com/repos/vbarrai/${repo}`, {
            next: { revalidate: 3600 },
          }),
          fetch(`https://api.github.com/repos/vbarrai/${repo}/contributors`, {
            next: { revalidate: 3600 },
          }),
        ]);
        const repoData = repoRes.ok ? await repoRes.json() : null;
        const contributorsData = contributorsRes.ok
          ? await contributorsRes.json()
          : [];
        return {
          stars: repoData?.stargazers_count ?? 0,
          forks: repoData?.forks_count ?? 0,
          contributors: Array.isArray(contributorsData)
            ? contributorsData.length
            : 0,
          commits: Array.isArray(contributorsData)
            ? contributorsData.reduce(
                (sum: number, c: { contributions: number }) =>
                  sum + c.contributions,
                0
              )
            : 0,
        };
      })
    );

    const totals = results.reduce(
      (acc, r) => ({
        stars: acc.stars + r.stars,
        forks: acc.forks + r.forks,
        contributors: acc.contributors + r.contributors,
        commits: acc.commits + r.commits,
      }),
      { stars: 0, forks: 0, contributors: 0, commits: 0 }
    );

    return [
      { value: REPOS.length, suffix: "", label: "Open Source Projects" },
      { value: totals.commits, suffix: "+", label: "Commits" },
      { value: totals.stars, suffix: "", label: "GitHub Stars" },
      { value: totals.contributors, suffix: "", label: "Contributors" },
    ];
  } catch {
    return [
      { value: REPOS.length, suffix: "", label: "Open Source Projects" },
      { value: 0, suffix: "", label: "Commits" },
      { value: 0, suffix: "", label: "GitHub Stars" },
      { value: 0, suffix: "", label: "Contributors" },
    ];
  }
}

export default async function Home() {
  const stats = await fetchGitHubStats();

  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection stats={stats} />
      <ProjectsSection />
      <Footer />
    </>
  );
}
