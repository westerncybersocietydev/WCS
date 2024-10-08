"use client"
// app/layout.tsx
import localFont from "next/font/local";
import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { UserProvider } from '../app/context/UserContext';
import { Toaster } from "react-hot-toast";
import GoogleAnalytics from '@/app/components/googleAnalytics';
import { metadataConfig } from "./metadata";
import PathMetadata from '@/app/components/PathMetadata'; // Import the new client component
import { useState } from "react";

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

// Function to get metadata based on path
const getMetadata = (path: string) => {
  return metadataConfig[path] || {
    title: "Western Cyber Society",
    description: "Home for innovators.",
    url: "http://westerncybersociety.ca/",
  };
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentPath, setCurrentPath] = useState<string | null>(null); // State to hold the current path
  const { title, description, url } = getMetadata(currentPath || '/'); // Fallback to root path

  return (
    <UserProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/wcsicon.ico" sizes="any" />
          <link rel="canonical" href="https://www.westerncybersociety.ca/" />
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta
            name="keywords"
            content="cyber society class, cyber society, western cyber society, join western cyber society, WCS, join WCS, developers society, Western AI, Toronto Tech Expo, join Toronto Tech Expo"
          />
          {/* Open Graph Tags */}
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content="https://www.westerncybersociety.ca/_next/image?url=%2FwcsLogo.png&w=128&q=75" />
          <meta property="og:url" content={url} />
          <meta property="og:type" content="website" />
          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content="https://www.westerncybersociety.ca/_next/image?url=%2FwcsLogo.png&w=128&q=75" />
        </head>
        <GoogleAnalytics />
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Toaster position="top-right" />
          <PathMetadata onPathChange={setCurrentPath} /> {/* Include the client component */}
          {children}
        </body>
      </html>
    </UserProvider>
  );
}