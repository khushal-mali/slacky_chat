import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Modals } from "@/components/modals";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import JotaiProvider from "@/components/jotai-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Slacky Chat",
  description:
    "Mainly used for workplace communication and collaboration on various tasks and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <ConvexClientProvider>
            <NuqsAdapter>
              <JotaiProvider>
                <Toaster />
                <Modals />
                {children}
              </JotaiProvider>
            </NuqsAdapter>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
