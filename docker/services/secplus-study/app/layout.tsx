import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security+ Study Hub",
  description: "Standalone Security+ study app with flashcards and practice exams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
