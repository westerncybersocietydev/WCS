"use client";
import { useRef } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const FAQS_DATA = [
  {
    question: "Do I need to have a club membership to attend events?",
    answer:
      "While most events are open to all attendees, membership offers discounts on event registrations and access to exclusive events held throughout the year.",
  },
  {
    question: "What kinds of resources does WCS provide for students?",
    answer:
      "WCS equips students with in-demand skills in AI, Cyber Security, Mainframe, and Web3 through workshops and competitions, while facilitating networking events.",
  },
  {
    question: "When do SIP project applications open? How do I apply?",
    answer:
      "We are excited to announce that project applications are now open! If you're interested in applying, please visit the SIP Projects page located under the About Us section.",
  },
  {
    question: "How can I stay updated on WCS events and announcements?",
    answer:
      "To stay updated with WCS, create an account on our website to receive email notifications about upcoming events, and be sure to follow us on our social media for the latest updates!",
  },
  {
    question: "Is prior experience with the required technology necessary for projects?",
    answer:
      "No, you don't need prior experience. If selected, you'll receive the time and resources to learn. What we value most is your enthusiasm and willingness to engage with the work.",
  },
];

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const FAQSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: textProgress } = useScroll({
    target: textRef,
    offset: ["start 85%", "start 45%"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  
  const textOpacity = useTransform(textProgress, [0, 1], [0, 1]);
  const textY = useTransform(textProgress, [0, 1], [40, 0]);
  const textFilter = useTransform(textProgress, [0, 1], ["blur(8px)", "blur(0px)"]);

  return (
    <section id="faq" ref={sectionRef} className="py-32 relative z-10">
      {/* Background Image Wrapper */}
      <div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0px, black 200px, black 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0px, black 200px, black 100%)",
        }}
      >
        <motion.img
          style={{ y: backgroundY }}
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true, margin: "-100px" }}
          src="/landing/newlanding3.jpeg"
          className="w-full h-[130%] absolute -top-[15%] object-cover opacity-100"
          alt="Abstract background"
        />
        <div className="absolute inset-0 bg-white/60" />
      </div>

      <div className="container px-6 md:px-12 mx-auto max-w-4xl relative z-10">
        <motion.div
          ref={textRef}
          style={{
            opacity: textOpacity,
            y: textY,
            filter: textFilter,
          }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-medium bg-clip-text text-transparent bg-gradient-to-br from-[#1a1a2e] via-[#4a4a6a] to-[#1a1a2e] mb-6 tracking-[-0.04em]"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
            }}
          >
            Frequently Asked Questions
          </h2>
          <p
            className="text-[18px] text-[#373a46] opacity-80 max-w-2xl mx-auto leading-relaxed"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
            }}
          >
            Everything you need to know about Western Cyber Society and how to
            get involved.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px", amount: 0.2 }}
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS_DATA.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-black/[0.04]"
              >
                <AccordionTrigger
                  className="text-left text-lg font-medium text-black hover:no-underline py-6"
                  style={{
                    fontFamily:
                      "var(--font-geist-sans), 'Geist', sans-serif",
                  }}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  className="text-[#373a46] opacity-80 text-base leading-relaxed pb-6"
                  style={{
                    fontFamily:
                      "var(--font-geist-sans), 'Geist', sans-serif",
                  }}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
