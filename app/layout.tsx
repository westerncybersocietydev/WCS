"use client";
// app/layout.tsx
import localFont from "next/font/local";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { UserProvider } from "../app/context/UserContext";
import { Toaster } from "react-hot-toast";
import GoogleAnalytics from "@/app/components/googleAnalytics";
import { metadataConfig } from "./metadata";
import PathMetadata from "@/app/components/PathMetadata";
import { useState } from "react";

const geistSans = localFont({
  src: "/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Function to get metadata based on path
const getMetadata = (path: string) => {
  return (
    metadataConfig[path] || {
      title: "Western Cyber Society",
      description: "Home for innovators.",
      url: "http://westerncybersociety.ca/",
    }
  );
};

// Function to create breadcrumb list based on the current path
const getBreadcrumbList = (currentPath: string) => {
  const breadcrumbList = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.westerncybersociety.ca/",
    },
  ];

  if (currentPath.includes("/overview")) {
    breadcrumbList.push({
      "@type": "ListItem",
      position: 2,
      name: "Overview",
      item: "https://www.westerncybersociety.ca/overview",
    });
  }

  if (currentPath.includes("/projects")) {
    breadcrumbList.push({
      "@type": "ListItem",
      position: 3,
      name: "Projects",
      item: "https://www.westerncybersociety.ca/projects",
    });
  }

  if (currentPath.includes("/events")) {
    breadcrumbList.push({
      "@type": "ListItem",
      position: 4,
      name: "Events",
      item: "https://www.westerncybersociety.ca/events",
    });
  }

  if (currentPath.includes("/meet-the-team")) {
    breadcrumbList.push({
      "@type": "ListItem",
      position: 5,
      name: "Meet the Team",
      item: "https://www.westerncybersociety.ca/meet-the-team",
    });
  }

  if (currentPath.includes("/ibm")) {
    breadcrumbList.push({
      "@type": "ListItem",
      position: 6,
      name: "IBM",
      item: "https://www.westerncybersociety.ca/ibm",
    });
  }

  if (currentPath.includes("/sponsorships")) {
    breadcrumbList.push({
      "@type": "ListItem",
      position: 7,
      name: "Sponsorships",
      item: "https://www.westerncybersociety.ca/sponsorships",
    });
  }

  return breadcrumbList;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentPath, setCurrentPath] = useState<string | null>(null); // State to hold the current path
  const { title, description, url } = getMetadata(currentPath || "/"); // Fallback to root path

  return (
    <UserProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/wcsNewLogo.ico" sizes="any" />
          <link rel="canonical" href="https://www.westerncybersociety.ca/" />
          {/* Preload fonts to prevent FOUC */}
          <link
            rel="preload"
            href="/fonts/GeistVF.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/GeistMonoVF.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Logirent.otf"
            as="font"
            type="font/otf"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/panton.black-caps.otf"
            as="font"
            type="font/otf"
            crossOrigin="anonymous"
          />
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta
            name="keywords"
            content="cyber society class, cyber society, western cyber society, join western cyber society, WCS, join WCS, developers society, Western AI, Toronto Tech Expo, join Toronto Tech Expo"
          />
          {/* Open Graph Tags */}
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta
            property="og:image"
            content="https://www.westerncybersociety.ca/_next/image?url=%2FwcsLogo.png&w=128&q=75"
          />
          <meta property="og:url" content={url} />
          <meta property="og:type" content="website" />
          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta
            name="twitter:image"
            content="https://www.westerncybersociety.ca/_next/image?url=%2FwcsLogo.png&w=128&q=75"
          />

          {/* JSON-LD for Organization */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Western Cyber Society",
                url: "https://www.westerncybersociety.ca",
                logo: "https://www.westerncybersociety.ca/_next/image?url=%2FwcsLogo.png&w=128&q=75",
                description:
                  "Begin your innovation journey with WCS. Join our cyber society classes, engage in exciting tech events, and connect with like-minded individuals.",
                sameAs: [
                  "https://www.linkedin.com/company/western-cyber-society?originalSubdomain=ca",
                  "https://www.instagram.com/westerncybersociety/",
                  "https://www.tiktok.com/@westerncybersociety",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "info@westerncybersociety.ca",
                  contactType: "Customer Support",
                },
              }),
            }}
          />

          {/* JSON-LD for Breadcrumb */}
          {currentPath && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  itemListElement: getBreadcrumbList(currentPath),
                }),
              }}
            />
          )}
        </head>
        <GoogleAnalytics />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster position="top-right" />
          <PathMetadata onPathChange={setCurrentPath} />{" "}
          {/* Include the client component */}
          {children}
        </body>
      </html>
    </UserProvider>
  );
}
