import Leftsidebar from "@/components/Leftsidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "echoAI - Home page",
  description: "Entry home page of echoai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <main>
            <Leftsidebar />
            {children}
            <p className="text-white-1">RIGHT SIDEBAR</p>
        </main>
    </div>
  );
}
