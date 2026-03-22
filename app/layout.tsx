import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "vbarrai — Open Source AI Tools",
  description:
    "vbarrai builds open-source tools for the AI era. From inference pipelines to prompt engineering, we empower developers to ship AI at scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased overflow-x-hidden">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
