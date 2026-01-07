"use client";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Carousel from "../components/eventCarousel";
import Image from "next/image";
import { motion } from "framer-motion";
import { images } from "../dataFiles/eventPage/images";
import { useRouter } from "next/navigation";

// How to add/edit an event
// - Upload event image to public/events
// - Log into MongoDB
// - Open collections and go to Events table.
// - On there, add/edit events.
// - For the image, put in the file path to the image (check other events as reference).

export default function Events() {
  const router = useRouter();

  return (
    <>
      <main>
        <div>
          <Navbar />
          <div className="text-black">
            <section
              className="mt-40 md:mt-16 relative w-full h-[55vw] md:h-[30vw] bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/projectBg.jpg')" }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
                  <h1 className="text-xl md:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Events
                  </h1>
                  <p className="text-sm md:text-lg md:text-xl leading-relaxed">
                    We host a variety of events aimed at bringing together tech
                    enthusiasts, industry professionals, and students for
                    networking and knowledge exchange. From workshops to guest
                    lectures, our events provide valuable opportunities for
                    learning and collaboration.
                  </p>
                </div>
              </div>
            </section>

            {/* Featured IBM Night Card */}
            <div className="mx-10 mb-10 mt-10">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: "-100px", once: true }}
                className="mb-8"
              >
                <h2 className="text-4xl font-bold text-gray-800 mb-5">
                  Featured Event
                </h2>
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ type: "tween", duration: 0.5 }}
                  viewport={{ margin: "-50px", once: true }}
                  onClick={() => router.push("/ibm-night")}
                  className="relative bg-black cursor-pointer w-full h-64 md:h-[30vw] overflow-hidden transition-transform duration-500 transform group hover:scale-105 shadow-[0_4px_10px_5px_rgba(0,0,0,0.75)]"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:blur-lg group-hover:opacity-90"
                    style={{ backgroundImage: 'url("/IBMN.png")' }}
                  />
                  <Image
                    src="/IBMN.png"
                    alt="IBM Night"
                    fill
                    className="w-full h-full object-cover transition-all duration-700 group-hover:translate-x-full group-hover:translate-y-full group-hover:blur-xl group-hover:scale-150"
                  />
                  <div
                    className="absolute text-xs md:text-sm xl:text-lg inset-0 flex items-center justify-center text-left text-white opacity-0 translate-x-32 transition-all delay-150 duration-300 group-hover:opacity-100 group-hover:translate-x-0 z-20"
                  >
                    <div className="p-5">
                      <p>
                        An evening of innovation and technology exploration
                        hosted by IBM, showcasing their latest advancements and
                        opportunities.
                      </p>
                    </div>
                  </div>
                  <span className="absolute bottom-[-30px] right-4 text-white text-xs font-semibold transition-all duration-700 ease-in-out group-hover:bottom-4">
                    View Details <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </motion.div>
              </motion.div>
            </div>

            <div className="flex justify-center mx-auto">
              <Carousel />
            </div>

            <div className="mx-10 mb-10 mt-10">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: "-100px", once: true }}
                className="text-4xl font-bold text-gray-800 mb-5"
              >
                WCS Time Capsule
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                {images.map((src, index) => (
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ type: "tween", duration: 0.5 }}
                    viewport={{ margin: "-50px", once: true }}
                    key={index}
                    className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src={src}
                      alt={`image-${index}`}
                      width={1000}
                      height={1000}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
}
