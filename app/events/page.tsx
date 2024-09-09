"use client"
import React, { useState } from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Modal from 'react-modal';

// Define TypeScript interface for event
interface Event {
  name: string;
  time: string;
  location: string;
  description: string;
  image: string;
}

// Sample events array with type
const events: Event[] = [
  {
    name: "Tech Innovations 2025",
    time: "Monday, January 12, 2025",
    location: "Tech Hall, Western University",
    description: "Join us for an immersive experience in the latest technological innovations. Discover groundbreaking advancements and connect with industry leaders.",
    image: "/overview.jpg",
  },
  {
    name: "Cybersecurity Workshop",
    time: "Friday, February 7, 2025",
    location: "Room 204, Western University",
    description: "Enhance your skills with our hands-on cybersecurity workshop. Learn from experts and get practical experience in securing digital environments.",
    image: "/overview.jpg",
  },
  {
    name: "Tech Innovations 2025",
    time: "Monday, January 12, 2025",
    location: "Tech Hall, Western University",
    description: "Join us for an immersive experience in the latest technological innovations. Discover groundbreaking advancements and connect with industry leaders.",
    image: "/overview.jpg",
  },
  {
    name: "Cybersecurity Workshop",
    time: "Friday, February 7, 2025",
    location: "Room 204, Western University",
    description: "Enhance your skills with our hands-on cybersecurity workshop. Learn from experts and get practical experience in securing digital environments.",
    image: "/overview.jpg",
  },
  {
    name: "Tech Innovations 2025",
    time: "Monday, January 12, 2025",
    location: "Tech Hall, Western University",
    description: "Join us for an immersive experience in the latest technological innovations. Discover groundbreaking advancements and connect with industry leaders.",
    image: "/overview.jpg",
  },
  {
    name: "Cybersecurity Workshop",
    time: "Friday, February 7, 2025",
    location: "Room 204, Western University",
    description: "Enhance your skills with our hands-on cybersecurity workshop. Learn from experts and get practical experience in securing digital environments.",
    image: "/overview.jpg",
  },
];

export default function Events() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div>
      <Navbar />
      <div className='text-black'>
        {/* Full-width background image with text */}
        <div
          className='relative w-screen h-80 bg-cover bg-center'
          style={{ backgroundImage: "url('/overviewBg.jpg')" }}
        >
          <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='text-white px-6'>
              <h1 className='text-4xl font-bold'>WCS Events</h1>
              <p className='mt-4 max-w-lg'>
                Dive into the future with Western Cyber Society&apos;s exciting lineup of events! From hands-on workshops to insightful seminars, we have something for everyone. Whether you&apos;re looking to explore the latest in technology, connect with industry experts, or enhance your skills, our events are designed to inspire and engage.
              </p>
            </div>
          </div>
        </div>
        
        {/* Image Carousel */}
        <div className='my-10'>
          <h2 className='text-2xl ml-5 mb-5 font-semibold'><strong>Upcoming Events</strong></h2>

          <Slider {...settings}>
            {events.map((event, index) => (
              <div key={index} className='relative group'>
                <img
                  className='w-full h-64 object-cover cursor-pointer'
                  src={event.image}
                  alt={event.name}
                  onClick={() => openModal(event)}
                />
                <div className='absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <h3 className='text-xl font-bold'>{event.name}</h3>
                  <p>{event.time}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Event Details"
        className="fixed inset-0 flex items-center justify-center bg-white rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        {selectedEvent && (
          <div className='flex w-full max-w-4xl bg-white rounded-lg shadow-lg text-black'>
            <img
              className='w-1/2 h-auto object-cover rounded-l-lg'
              src={selectedEvent.image}
              alt={selectedEvent.name}
            />
            <div className='w-1/2 p-6'>
              <h2 className='text-2xl font-bold'>{selectedEvent.name}</h2>
              <p className='text-lg mt-2'>{selectedEvent.location}</p>
              <p className='text-lg'>{selectedEvent.time}</p>
              <p className='mt-4'>{selectedEvent.description}</p>
              <button
                onClick={() => alert("RSVP button clicked")}
                className='mt-6 bg-blue-500 text-white px-4 py-2 rounded'
              >
                RSVP
              </button>
              <button
                onClick={closeModal}
                className='mt-2 ml-auto text-red-500 underline'
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  )
}