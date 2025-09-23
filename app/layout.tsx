import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "../providers/convexClientProviders";
import AudioProvider from "../providers/AudioProvider";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EchoAI",
  description: "Generates podcast through the use of AI",
  icons: '/icons/logo.svg'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ConvexClientProvider>
        <html lang="en">
          <AudioProvider>
            <body className={manrope.className}>
                {children}
            </body>
          </AudioProvider>
        </html>
      </ConvexClientProvider>
  );
}
