import { redirect } from "next/navigation";
import { allDocs } from "./docs-data";

export async function generateStaticParams() {
  return Object.keys(allDocs).map((slug) => ({ slug }));
}

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const docs = allDocs[slug];

  if (!docs || docs.sections.length === 0) {
    redirect(`/${slug}`);
  }

  redirect(`/${slug}/docs/${docs.sections[0].slug}`);
}
