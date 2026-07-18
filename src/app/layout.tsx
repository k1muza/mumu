import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import FullscreenButton from "@/components/FullscreenButton";
import OnboardingGate from "@/components/OnboardingGate";
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
    "A multi-subject learning universe for early learners — explore English, Maths, Science, Shona and Mandarin worlds with Aki the dragon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <OnboardingGate />
        {children}
        <FullscreenButton />
      </body>
    </html>
  );
}
