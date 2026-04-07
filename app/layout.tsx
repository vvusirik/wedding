import type { Metadata } from "next";
import { Great_Vibes, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/navbar";
import localFont from "next/font/local";
import { cookies } from "next/headers";

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const edLavonia = localFont({
  src: "../public/fonts/edlavonia-regular-webfont.woff",
  variable: "--font-ed-lavonia",
  weight: "400",
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const renogare = localFont({
  src: "../public/fonts/Renogare-Regular.woff",
  variable: "--font-renogare",
  weight: "300",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hanna & Vishal | Wedding",
  description:
    "Join us to celebrate the wedding of Hanna and Vishal — an Indian and Jewish fusion celebration of love.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("wedding-auth")?.value === "true";

  return (
    <html
      lang="en"
      className={`${greatVibes.variable} ${edLavonia.variable} ${renogare.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {isAuthenticated && <Navbar />}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
