import type { Metadata } from "next";
import Image from "next/image";

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
        <main className="relative h-screen w-full">
          <div className="absolute size-full">
            <Image src='/images/bg-img.png' alt='background' fill className='size-full' />
          </div>
          // 1:37:33
            {children}
        </main>
    </div>
  );
}
