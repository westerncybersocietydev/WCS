"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  backgroundImage?: string;
  children?: React.ReactNode;
}

export default function PageHero({
  eyebrow,
  title,
  description,
  backgroundImage,
  children,
}: PageHeroProps) {
  const hasImage = !!backgroundImage;

  return (
    <section className="relative w-full">
      {/* Background image layer */}
      {hasImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/85 via-[#1a1a2e]/75 to-[#1a1a2e]/95" />
          {/* Subtle grain texture */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
      )}

      {/* Plain white fallback with decorative orbs */}
      {!hasImage && (
        <>
          <div className="absolute inset-0 bg-[#fafafa] z-0" />
          <div
            className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06] z-[1]"
            style={{
              background:
                "radial-gradient(circle, #4a4a6a 0%, transparent 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 w-[380px] h-[380px] rounded-full opacity-[0.05] z-[1]"
            style={{
              background:
                "radial-gradient(circle, #1a1a2e 0%, transparent 70%)",
            }}
          />
        </>
      )}

      {/* Content */}
      <div
        className={`relative z-10 max-w-5xl mx-auto px-6 text-center ${
          hasImage
            ? "pt-36 pb-24 md:pt-44 md:pb-32"
            : "pt-32 pb-16 md:pt-40 md:pb-20"
        }`}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="flex flex-col items-center"
        >
          {/* Eyebrow */}
          {eyebrow && (
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut" },
                },
              }}
              className={`font-medium tracking-[0.2em] uppercase text-[11px] md:text-[13px] mb-5 ${
                hasImage ? "text-white/50" : "text-black/35"
              }`}
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              }}
            >
              {eyebrow}
            </motion.p>
          )}

          {/* Title */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: "easeOut" },
              },
            }}
            className={`text-[32px] md:text-[56px] lg:text-[68px] leading-[1.05] tracking-tight font-semibold mb-6 ${
              hasImage
                ? "text-white"
                : "bg-clip-text text-transparent bg-gradient-to-br from-[#1a1a2e] via-[#4a4a6a] to-[#1a1a2e]"
            }`}
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
            }}
          >
            {title}
          </motion.h1>

          {/* Divider */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: {
                opacity: 1,
                scaleX: 1,
                transition: { duration: 0.6, ease: "easeOut" },
              },
            }}
            className={`w-10 h-px mb-6 origin-center ${
              hasImage ? "bg-white/20" : "bg-black/10"
            }`}
          />

          {/* Description */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: "easeOut" },
              },
            }}
            className={`text-[14px] md:text-[16px] leading-[1.8] max-w-2xl ${
              hasImage ? "text-white/60" : "text-black/50"
            }`}
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
            }}
          >
            {description}
          </motion.p>

          {/* Optional CTA slot */}
          {children && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut" },
                },
              }}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>

    </section>
  );
}
