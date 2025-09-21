"use client";
import React from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Image from "next/image";

export default function Sponsorships() {
  return (
    <>
      <main>
        <div>
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div>
              <div className="relative w-[15vw] h-[20vw] overflow-hidden">
                {" "}
                {/* Set height to maintain aspect ratio */}
                <Image
                  src="/construction1.png"
                  alt="Page Under Construction"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent text-4xl font-bold">
              Coming Soon...
            </h1>
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
}
