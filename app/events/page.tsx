"use client"
import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Carousel from '../components/eventCarousel'; // Import the custom Carousel
import Image from 'next/image';

// Define TypeScript interface for event
interface Event {
  name: string;
  time: string;
  location: string;
  price: string;
  description: string;
  image: string;
}

// Sample events array with type
const events: Event[] = [
  {
    name: "Tech Innovations 2025",
    time: "Monday, January 12, 2025",
    location: "Tech Hall, Western University",
    price: "$5",
    description: "Join us for an immersive experience in the latest technological innovations. Discover groundbreaking advancements and connect with industry leaders.",
    image: "/overview.jpg",
  },
  {
    name: "Cybersecurity Workshop",
    time: "Friday, February 7, 2025",
    location: "Room 204, Western University",
    price: "$5",
    description: "Enhance your skills with our hands-on cybersecurity workshop. Learn from experts and get practical experience in securing digital environments.",
    image: "/overview.jpg",
  },
  {
    name: "Tech Innovations 2025",
    time: "Monday, January 12, 2025",
    location: "Tech Hall, Western University",
    price: "$5",
    description: "Join us for an immersive experience in the latest technological innovations. Discover groundbreaking advancements and connect with industry leaders.",
    image: "/overview.jpg",
  },
  {
    name: "Cybersecurity Workshop",
    time: "Friday, February 7, 2025",
    location: "Room 204, Western University",
    price: "$5",
    description: "Enhance your skills with our hands-on cybersecurity workshop. Learn from experts and get practical experience in securing digital environments.",
    image: "/overview.jpg",
  },
  {
    name: "Tech Innovations 2025",
    time: "Monday, January 12, 2025",
    location: "Tech Hall, Western University",
    price: "$5",
    description: "Join us for an immersive experience in the latest technological innovations. Discover groundbreaking advancements and connect with industry leaders.",
    image: "/overview.jpg",
  },
  {
    name: "Cybersecurity Workshop",
    time: "Friday, February 7, 2025",
    location: "Room 204, Western University",
    price: "$5",
    description: "Enhance your skills with our hands-on cybersecurity workshop. Learn from experts and get practical experience in securing digital environments. Enhance your skills with our hands-on cybersecurity workshop. Learn from experts and get practical experience in securing digital environments. Enhance your skills with our hands-on cybersecurity workshop. Learn from experts and get practical experience in securing digital environments.",
    image: "/overview.jpg",
  },
];

const images = [
  "/overview.jpg",
  "/overview.jpg",
  "/overview.jpg",
  "/overview.jpg",
  "/overview.jpg",
  "/overview.jpg",
];


export default function Events() {

  return (
    <div>
      <Navbar />
      <div className='text-black'>
        {/* Full-width background image with text */}
        <div
          className='relative w-full h-80 bg-cover bg-center'
          style={{ backgroundImage: "url('/overviewBg.jpg')" }}
        >
          <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center'>
            <div className='text-white px-6'>
              <h1 className='text-4xl font-bold'>WCS Events</h1>
              <p className='mt-4 max-w-lg'>
                Dive into the future with Western Cyber Society&apos;s exciting lineup of events! From hands-on workshops to insightful seminars, we have something for everyone. Whether you&apos;re looking to explore the latest in technology, connect with industry experts, or enhance your skills, our events are designed to inspire and engage.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mx-auto">
          <Carousel
            items={events.map((event) => ({
              name: event.name,
              image: event.image,
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