import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/[0.04] py-16 relative z-10">
      <div className="container mx-auto px-6 md:px-12 flex flex-wrap gap-10 md:gap-16">
        <div className="w-full md:w-auto flex-1 min-w-[200px]">
          <div className="flex items-center mb-6">
            <img
              src="/wcsLogo.png"
              alt="Western Cyber Society Logo"
              className="h-8 w-auto text-black"
            />
            <span
              className="ml-3 font-semibold text-black tracking-tight"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              }}
            >
              Western Cyber Society
            </span>
          </div>
        </div>

        <div className="w-1/2 sm:w-auto flex-1 min-w-[140px]">
          <h4
            className="font-medium text-black text-[15px] mb-4 tracking-tight"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
            }}
          >
            Resources
          </h4>
          <ul className="space-y-3 text-[14px] text-[#373a46] opacity-80">
            <li>
              <a
                href="/overview"
                className="hover:text-black hover:opacity-100 transition-colors"
              >
                Overview
              </a>
            </li>
            <li>
              <a
                href="/projects"
                className="hover:text-black hover:opacity-100 transition-colors"
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="/events"
                className="hover:text-black hover:opacity-100 transition-colors"
              >
                Events
              </a>
            </li>
          </ul>
        </div>

        <div className="w-1/2 sm:w-auto flex-1 min-w-[140px]">
          <h4
            className="font-medium text-black text-[15px] mb-4 tracking-tight"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
            }}
          >
            Team & Partners
          </h4>
          <ul className="space-y-3 text-[14px] text-[#373a46] opacity-80">
            <li>
              <a
                href="/meet-the-team"
                className="hover:text-black hover:opacity-100 transition-colors"
              >
                Meet the Team
              </a>
            </li>
            <li>
              <a
                href="/sponsorships"
                className="hover:text-black hover:opacity-100 transition-colors"
              >
                Sponsorships
              </a>
            </li>
            <li>
              <a
                href="/ibm"
                className="hover:text-black hover:opacity-100 transition-colors"
              >
                IBM
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full sm:w-auto flex-1 min-w-[140px]">
          <h4
            className="font-medium text-black text-[15px] mb-4 tracking-tight"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
            }}
          >
            Connect With Us
          </h4>
          <ul className="space-y-3 text-[14px] text-[#373a46] opacity-80">
            <li>
              <a
                href="/contact"
                className="hover:text-black hover:opacity-100 transition-colors"
              >
                Get in Touch
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/westerncybersociety/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black hover:opacity-100 transition-colors"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/western-cyber-society/mycompany/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black hover:opacity-100 transition-colors"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-black/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
        <p
          className="text-[#373a46] opacity-60 text-[14px]"
          style={{
            fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
          }}
        >
          © {new Date().getFullYear()} Western Cyber Society. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
}
