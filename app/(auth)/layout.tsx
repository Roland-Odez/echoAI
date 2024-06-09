import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "echoAI - Login/Signup",
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
            {children}
        </main>
    </div>
  );
}
