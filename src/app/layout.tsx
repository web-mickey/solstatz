import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Sol Statz",
  description:
    "Solana on-chain MEV and trading data aggregator for Raydium V4 and Pump Fun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Sol Statz - Real onchain data</title>
      </head>
      <body className={`${roboto.variable} antialiased`}>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <Sidebar />
            <div className="lg:ml-48 min-h-screen flex flex-col">
              <MobileNav />
              <div className="text-sm text-center p-4 text-brand bg-brand/10 mb-4">
                Sol Statz is a data aggregator for Raydium V4 and Pump Fun.
                Since this is a very early product, some data might still be
                missing.
              </div>
              <main className="flex-1 overflow-auto p-4 ">{children}</main>
              <Footer />
            </div>
            <Analytics />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
