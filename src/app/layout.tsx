import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/common/Navbar";
import SessionProvider from "@/utils/SessionProvider";
import { auth } from "@/auth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Job App",
  description: "Job App | Apply using Job App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <SessionProvider session={session}>
        <body className={`${poppins.className} min-h-full flex flex-col`}>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </body>
      </SessionProvider>
    </html>
  );
}
