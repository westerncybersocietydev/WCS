"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

interface IBMPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const IBMPopup: React.FC<IBMPopupProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const highlights = [
        "Interactive presentations on IBM's latest technologies",
        "Networking with IBM professionals and students",
        "Career insights and internship opportunities",
        "Hands-on tech demonstrations",
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 text-white/80 hover:text-white transition-colors bg-black/30 hover:bg-black/50 rounded-full w-8 h-8 flex items-center justify-center"
                    aria-label="Close"
                >
                    <i className="fa-solid fa-times"></i>
                </button>

                {/* Image Section */}
                <div className="relative w-full h-48 md:h-56">
                    <Image
                        src="/IBMN.png"
                        alt="IBM Night Event"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                {/* Frosted Glass Content Section */}
                <div className="relative bg-white/80 backdrop-blur-xl p-6 text-center">
                    {/* Subtle gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/90 pointer-events-none"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
                            IBM Night is Here!
                        </h2>
                        <p className="text-violet-600 font-bold text-xl mb-4">
                            Early Bird Tickets — Only $5
                        </p>

                        {/* What to Expect */}
                        <div className="text-left mb-6 bg-white/60 backdrop-blur-md rounded-xl p-4 border border-white/50 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                What to Expect
                            </h3>
                            <ul className="space-y-2">
                                {highlights.map((item, index) => (
                                    <li key={index} className="flex items-start text-gray-700 text-sm">
                                        <i className="fa-solid fa-check-circle text-violet-500 mr-2 mt-0.5 flex-shrink-0"></i>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA Button */}
                        <Link
                            href="/ibm-night/ticket"
                            className="block w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                        >
                            GET TICKETS NOW
                        </Link>

                        {/* Dismiss Link */}
                        <button
                            onClick={onClose}
                            className="mt-4 text-gray-500 hover:text-gray-700 underline text-sm font-medium transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default IBMPopup;
