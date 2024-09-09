"use client"
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    topic: 'general',
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const [charCount, setCharCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'message') {
      setCharCount(value.length);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send the form data to the backend.
    setSubmitted(true);
  };

  if (submitted) {
    return (
    <div>
    <Navbar />
      <div className="p-6 text-center text-black mt-20">
        <h2 className="text-2xl font-bold">Submission Successful!</h2>
        <p className="mt-4">Thank you for reaching out. We will get back to you as soon as possible.</p>
        <a href="/" className="mt-5 inline-block text-blue-500 font-semibold py-2 px-4 border-2 border-blue-500
         rounded transition-all duration-300 hover:bg-blue-500 hover:text-white hover:transform 
         hover:translate-y-[-3px] focus:outline-none focus:ring-2 focus:ring-blue-500">
        Go back to Home page</a>
      </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
    <Navbar />
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-12 text-black">
      <h1 className="text-3xl font-bold mb-4 text-center">Contact Us</h1>
      <p className="mb-6 text-gray-600">Have a question or need assistance? Fill out the form below with your inquiry, and we'll get back to you as soon as possible!</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="topic" className="block mb-2">Topic</label>
          <select
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="general">General</option>
            <option value="events">Events & Projects</option>
            <option value="sponsorships">Sponsorships</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="firstName" className="block mb-2">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block mb-2">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">UWO Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            pattern=".+@uwo\.ca"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block mb-2">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            maxLength={500}
            rows={5}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-sm text-gray-500 mt-1">{500 - charCount} characters remaining</p>
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
    <Footer />
</div>
  );
}
