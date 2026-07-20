import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import FullscreenButton from "@/components/FullscreenButton";
import OnboardingGate from "@/components/OnboardingGate";
import OfflineReadyGate from "@/components/OfflineReadyGate";
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/solid.min.css";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Learning Universe",
  description:
    "A multi-subject learning universe for early learners — explore English, Maths, Science, Shona, Mandarin and Social Sciences worlds with Aki the dragon.",
  openGraph: {
    type: "website",
    title: "Learning Universe",
    description:
      "A multi-subject learning universe for early learners — explore English, Maths, Science, Shona, Mandarin and Social Sciences worlds with Aki the dragon.",
    siteName: "Learning Universe",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning Universe",
    description:
      "A multi-subject learning universe for early learners — explore English, Maths, Science, Shona, Mandarin and Social Sciences worlds with Aki the dragon.",
  },
  appleWebApp: {
    capable: true,
    title: "Learning Universe",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#4c39a0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <OfflineReadyGate />
        <OnboardingGate />
        {children}
        <FullscreenButton />
        <Analytics />
      </body>
    </html>
  );
}
