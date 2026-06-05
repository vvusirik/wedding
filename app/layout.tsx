import type { Metadata } from "next";
import { Great_Vibes, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/navbar";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import { GuestProvider } from "./_context/guest";

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

const cormorantGaramond = localFont({
  src: [
    {
      path: "../public/fonts/CormorantGaramond-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantGaramond-Regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantGaramond-Regular.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantGaramond-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

const cormorantUpright = localFont({
  src: "../public/fonts/CormorantUpright-Bold.woff2",
  variable: "--font-cormorant-upright",
  weight: "700",
  display: "swap",
});

const domLovesMaryPro = localFont({
  src: "../public/fonts/DomLovesMaryPro.woff2",
  variable: "--font-dom-loves-mary",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vishal & Hanna | Wedding",
  description:
    "Join us to celebrate the wedding of Vishal and Hanna — an Indian and Jewish fusion celebration of love.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("wedding-auth")?.value === "true";
  const guestRaw = cookieStore.get("wedding-guest")?.value;
  const parsed = guestRaw ? JSON.parse(guestRaw) : {};
  const guest = {
    firstName: parsed.firstName ?? "",
    lastName: parsed.lastName ?? "",
    tags: parsed.tags ?? [],
    slug: parsed.slug ?? "",
  };

  return (
    <html
      lang="en"
      className={`${greatVibes.variable} ${edLavonia.variable} ${renogare.variable} ${lato.variable} ${cormorantGaramond.variable} ${cormorantUpright.variable} ${domLovesMaryPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <GuestProvider guest={guest}>
          {isAuthenticated && <Navbar />}
          <main className="flex-1">{children}</main>
        </GuestProvider>
      </body>
    </html>
  );
}
