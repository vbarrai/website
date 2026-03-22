import { notFound } from "next/navigation";
import Link from "next/link";
import { allDocs, projectMeta } from "../docs-data";

export async function generateStaticParams() {
  const params: { slug: string; section: string }[] = [];
  for (const [slug, docs] of Object.entries(allDocs)) {
    for (const section of docs.sections) {
      params.push({ slug, section: section.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; section: string }>;
}) {
  const { slug, section } = await params;
  const docs = allDocs[slug];
  const meta = projectMeta[slug];
  const sectionData = docs?.sections.find((s) => s.slug === section);

  if (!sectionData || !meta) {
    return { title: "Page introuvable" };
  }

  return {
    title: `${sectionData.title} — ${meta.name} docs — vbarrai`,
    description: `Documentation ${meta.name} : ${sectionData.title}`,
  };
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div key={elements.length} className="my-4">
          {lang && (
            <div className="px-4 py-1.5 bg-white/5 border border-white/6 border-b-0 rounded-t-lg">
              <span className="text-xs text-zinc-500 font-mono">{lang}</span>
            </div>
          )}
          <pre
            className={`code-block px-4 py-3 overflow-x-auto text-sm leading-relaxed ${lang ? "rounded-t-none" : ""}`}
          >
            <code className="text-zinc-300">{codeLines.join("\n")}</code>
          </pre>
        </div>,
      );
      continue;
    }

    // Table
    if (line.includes("|") && line.trim().startsWith("|")) {
      const tableLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].includes("|") &&
        lines[i].trim().startsWith("|")
      ) {
        tableLines.push(lines[i]);
        i++;
      }

      if (tableLines.length >= 2) {
        const headers = tableLines[0]
          .split("|")
          .filter((c) => c.trim())
          .map((c) => c.trim());
        const rows = tableLines.slice(2).map((row) =>
          row
            .split("|")
            .filter((c) => c.trim())
            .map((c) => c.trim()),
        );

        elements.push(
          <div
            key={elements.length}
            className="my-4 overflow-x-auto rounded-lg border border-white/6"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/6 bg-white/3">
                  {headers.map((h, j) => (
                    <th
                      key={j}
                      className="px-4 py-2.5 text-left text-zinc-300 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-white/3 last:border-0">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-2.5 text-zinc-400">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
        continue;
      }
    }

    // Heading
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={elements.length} className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 mt-8 first:mt-0">
          {line.slice(2)}
        </h1>,
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={elements.length} className="text-2xl font-bold mt-10 mb-4">
          {line.slice(3)}
        </h2>,
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={elements.length} className="text-lg font-semibold mt-8 mb-3">
          {line.slice(4)}
        </h3>,
      );
      i++;
      continue;
    }

    // Unordered list
    if (line.match(/^[-*] /)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        listItems.push(lines[i].replace(/^[-*] /, ""));
        i++;
      }
      elements.push(
        <ul key={elements.length} className="my-3 space-y-1.5">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-2 text-zinc-400">
              <span className="text-zinc-600 mt-1.5 shrink-0">•</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\. /)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        listItems.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={elements.length} className="my-3 space-y-1.5">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-3 text-zinc-400">
              <span className="text-zinc-500 font-mono text-sm mt-0.5 shrink-0">
                {li + 1}.
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={elements.length} className="text-zinc-400 leading-relaxed my-3">
        {renderInline(line)}
      </p>,
    );
    i++;
  }

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Match bold, inline code, links, and emoji markers
  const regex = /(\*\*(.+?)\*\*)|(`([^`]+)`)|(\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Bold
      parts.push(
        <strong key={parts.length} className="text-zinc-200 font-semibold">
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      // Inline code
      parts.push(
        <code
          key={parts.length}
          className="px-1.5 py-0.5 bg-white/5 border border-white/6 rounded text-sm font-mono text-zinc-300"
        >
          {match[4]}
        </code>,
      );
    } else if (match[5]) {
      // Link
      parts.push(
        <a
          key={parts.length}
          href={match[7]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
        >
          {match[6]}
        </a>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

export default async function DocsSectionPage({
  params,
}: {
  params: Promise<{ slug: string; section: string }>;
}) {
  const { slug, section } = await params;
  const docs = allDocs[slug];
  const meta = projectMeta[slug];

  if (!docs || !meta) notFound();

  const sectionData = docs.sections.find((s) => s.slug === section);
  if (!sectionData) notFound();

  const currentIndex = docs.sections.findIndex((s) => s.slug === section);
  const prevSection = currentIndex > 0 ? docs.sections[currentIndex - 1] : null;
  const nextSection =
    currentIndex < docs.sections.length - 1
      ? docs.sections[currentIndex + 1]
      : null;

  return (
    <article>
      <MarkdownRenderer content={sectionData.content} />

      {/* Prev / Next navigation */}
      <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between gap-4">
        {prevSection ? (
          <Link
            href={`/${slug}/docs/${prevSection.slug}`}
            className="group flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>{prevSection.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextSection ? (
          <Link
            href={`/${slug}/docs/${nextSection.slug}`}
            className="group flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <span>{nextSection.title}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </article>
  );
}
