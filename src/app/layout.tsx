import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anka Tech Investimentos",
  description: "Gerenciamento de clientes e ativos financeiros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <ReactQueryProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}