import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white relative z-10">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-wrap gap-10 md:gap-16">
          {/* Brand */}
          <div className="w-full md:w-auto flex-1 min-w-[200px]">
            <div className="flex items-center mb-5">
              <Image
                src="/wcsLogo.png"
                alt="Western Cyber Society Logo"
                width={28}
                height={28}
                className="h-7 w-auto brightness-0 invert"
              />
              <span
                className="ml-3 font-semibold text-white/90 text-[15px] tracking-tight"
                style={{
                  fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                }}
              >
                Western Cyber Society
              </span>
            </div>
            <p
              className="text-[13px] text-white/35 leading-[1.7] max-w-[260px]"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              }}
            >
              Fostering innovation, collaboration, and the next generation of tech leaders.
            </p>
          </div>

          {/* Resources */}
          <div className="w-1/2 sm:w-auto flex-1 min-w-[130px]">
            <h4
              className="font-medium text-white/90 text-[13px] mb-4 tracking-tight uppercase tracking-[0.08em]"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              }}
            >
              Resources
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Overview", href: "/overview" },
                { label: "Projects", href: "/projects" },
                { label: "Events", href: "/events" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[13px] text-white/40 hover:text-white/70 transition-colors"
                    style={{
                      fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Team & Partners */}
          <div className="w-1/2 sm:w-auto flex-1 min-w-[130px]">
            <h4
              className="font-medium text-white/90 text-[13px] mb-4 tracking-tight uppercase tracking-[0.08em]"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              }}
            >
              Team & Partners
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Meet the Team", href: "/meet-the-team" },
                { label: "Sponsorships", href: "/sponsorships" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[13px] text-white/40 hover:text-white/70 transition-colors"
                    style={{
                      fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="w-full sm:w-auto flex-1 min-w-[130px]">
            <h4
              className="font-medium text-white/90 text-[13px] mb-4 tracking-tight uppercase tracking-[0.08em]"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              }}
            >
              Connect
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Get in Touch", href: "/contact", external: false },
                {
                  label: "Instagram",
                  href: "https://www.instagram.com/westerncybersociety/",
                  external: true,
                },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/company/western-cyber-society/mycompany/",
                  external: true,
                },
              ].map(({ label, href, external }) => (
                <li key={label}>
                  <Link
                    href={href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-[13px] text-white/40 hover:text-white/70 transition-colors inline-flex items-center gap-1.5"
                    style={{
                      fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                    }}
                  >
                    {label}
                    {external && (
                      <svg
                        className="w-3 h-3 opacity-60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-3">
          <p
            className="text-white/25 text-[12px]"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
            }}
          >
            © {new Date().getFullYear()} Western Cyber Society. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
