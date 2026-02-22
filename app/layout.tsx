import type { Metadata } from "next";
import "./globals.css";
import BuilderRegistry from "../components/builder/BuilderRegistry";

export const metadata: Metadata = {
  title: "Wedding Blueprint Generator",
  description: "A dynamic wedding design blueprint for the DIY bride.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <BuilderRegistry />
        {children}
      </body>
    </html>
  );
}
