import { ConvexClientProvider } from "@/components/convex-client-provider";
import JotaiProvider from "@/components/jotai-provider";
import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
import { constructMetadata } from "@/lib/utils";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata();

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
