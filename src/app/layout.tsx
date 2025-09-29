import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canalyzer Demo",
  description: "Canalyzer Demo Application",
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