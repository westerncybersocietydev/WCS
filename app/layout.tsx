import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css'
import { UserProvider } from '../app/context/UserContext';
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Western Cyber Society",
  description: "Home for innovators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
    </UserProvider>
  );
}
