"use client"
import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Carousel from '../components/eventCarousel';
import Image from 'next/image';
import { EventObject, getAllEvents } from '../lib/actions/event.action';

const images = [
  "/overview.jpg",
  "/overview.jpg",
  "/overview.jpg",
  "/overview.jpg",
  "/overview.jpg",
  "/overview.jpg"
]

export default function Events() {
  const [events, setEvents] = useState<EventObject[]>([]); // State to store events

  useEffect(() => {
    // Fetch events when the component mounts
    async function fetchEvents() {
      try {
        const eventData = await getAllEvents(); // Call the API to get events
        setEvents(eventData); // Set the fetched events to state
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div>
      <Navbar />
      <div className='text-black'>
        {/* Full-width background image with text */}
        <section
          className="mt-16 relative w-full h-[30vw] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/projectBg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Events</h1>
              <p className="text-lg md:text-xl leading-relaxed">
                SIPs have been meticulously crafted with industry professionals to equip coordinators with essential skills. Dive into hands-on experience with high-demand software and skills through WCS Projects.
              </p>
            </div>
          </div>
        </section>
        <div className="flex justify-center mx-auto">
          <Carousel
            items={events.map((event) => ({
              id: event.id,
              name: event.name,
              image: event.image,
              date: event.date,
              time: event.time,
              price: event.price,
              location: event.location,
              description: event.description,
            }))}
          />
        </div>

        <div className='mx-10 mb-10 mt-10'>
      <h2 className="text-4xl font-bold text-gray-800 mb-5">WCS Time Capsule</h2>
      <div className="grid grid-cols-3 gap-4 p-4">
      {images.map((src, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
        >
          <Image
            src={src}
            alt={`image-${index}`}
            layout="responsive"
            width={1000}  // Use a width that's larger than the container width
            height={1000} // Maintain the aspect ratio
            objectFit="fill"
            className="w-full h-full"
          />
        </div>
      ))}
    </div>

    </div>
      </div>
      <Footer />
    </div>
  )
}