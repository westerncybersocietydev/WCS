"use client"
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Carousel from '../components/eventCarousel';
import Image from 'next/image';
import { motion } from "framer-motion"
import { images } from '../dataFiles/eventPage/images';

// How to add/edit an event
// - Upload event image to public/events
// - Log into MongoDB
// - Open collections and go to Events table.
// - On there, add/edit events.
// - For the image, put in the file path to the image (check other events as reference).

export default function Events() {
  return (
    <>
      <main>
    <div>
      <Navbar />
      <div className='text-black'>
        {/* Full-width background image with text */}
        <section
          className="mt-40 md:mt-16 relative w-full h-[55vw] md:h-[30vw] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/projectBg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
              <h1 className="text-xl md:text-5xl md:text-6xl font-bold mb-6 leading-tight">Events</h1>
              <p className="text-sm md:text-lg md:text-xl leading-relaxed">
              We host a variety of events aimed at bringing together tech enthusiasts, industry professionals, and students for networking and knowledge exchange. From workshops to guest lectures, our events provide valuable opportunities for learning and collaboration.
              </p>
            </div>
          </div>
        </section>

        <div className="flex justify-center mx-auto">
          <Carousel />
        </div>

        <div className='mx-10 mb-10 mt-10'>
          <motion.h2 
      initial={ { opacity: 0, } }
      whileInView={ { opacity: 1 } }
      viewport={ { margin: '-100px', once: true } } 
          className="text-4xl font-bold text-gray-800 mb-5">WCS Time Capsule</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {images.map((src, index) => (
              <motion.div
              initial={{ y: 100, opacity: 0 }} // Start from right (x: 100) and invisible
              whileInView={{ y: 0, opacity: 1 }} // Slide to its original position (x: 0) and become visible
              transition={{ type: "tween", duration: 0.5 }} // You can adjust the transition properties
              viewport={{ margin: "-50px", once: true }}
                key={index}
                className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <Image
                  src={src}
                  alt={`image-${index}`}
                  layout="responsive"
                  width={1000} // Keep the width and height the same for responsiveness
                  height={1000}
                  objectFit="cover"
                  className="w-full h-full"
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
  )
}