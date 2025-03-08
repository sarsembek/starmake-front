import type { Metadata } from "next";
import "../globals.css";

// const geistSans = Geist({
//    variable: "--font-geist-sans",
//    subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//    variable: "--font-geist-mono",
//    subsets: ["latin"],
// });

export const metadata: Metadata = {
   title: "Authentication - StarMake",
   description: "Login or register for StarMake platform",
};

export default function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   // Don't include html or body tags here - just return the children
   return children;
}
