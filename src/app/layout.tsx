import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riwaayat Studio | Premium Clothing",
  description: "Riwaayat Studio official store — discover latest collections, stock status, and secure contact support.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f6f2ec] text-zinc-900 antialiased">{children}</body>
    </html>
  );
}
