import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/provider";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ANAKTUMBUH.ID | Kepala Sekolah",
  description: "Sistem Pemantauan 7 Kebiasaan Anak Indonesia Hebat",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="id">
      <body className={`${urbanist.className} antialiased`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
};

export default RootLayout;
