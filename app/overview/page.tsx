"use client"
import React from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Overview() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      <Navbar />

      {/* Full-width background image with text */}
      <div
        className='relative w-full h-screen bg-cover bg-center'
        style={{ backgroundImage: "url('/overviewBg.jpg')" }}
      >
        <div className='absolute inset-0 bg-black bg-opacity-50 flex text-left items-center'>
          <div className=' text-white px-4 ml-8'>
            <h1 className='text-4xl font-bold'>Western Cyber Society</h1>
            <p className='mt-6 max-w-xl'>
              Western Cyber Society (WCS) is the future generation of leaders in Artificial Intelligence (AI), Cyber Security, and Web3. Our mission is to empower driven students to thrive in the most pivotal sectors of technology. At WCS, students are equipped with high-demand skills through workshops, projects, and competitions. Western Cyber Society empowers students to create digital solutions for industries such as FinTech, Engineering, Medicine, and Law.
            </p>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Focus Statements */}
      <div className="text-center py-24 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-5xl font-extrabold text-gray-900">Our Mission</h2>
          <p className="mt-6 text-gray-700 leading-relaxed">
            To create innovative solutions that empower communities, enhance connectivity, and foster sustainable growth. 
            By leveraging cutting-edge technologies, we aim to drive positive change that benefits individuals and societies alike.
          </p>
        </div>

        <div className="mx-auto max-w-3xl px-6 mt-16">
          <h2 className="text-5xl font-extrabold text-gray-900">Our Vision</h2>
          <p className="mt-6 text-gray-700 leading-relaxed">
            To be a global leader in transformative technology, creating a future where seamless connectivity and sustainable innovation improve lives across the world. 
            We envision a world where technology works harmoniously with nature and human progress, creating solutions that are not only groundbreaking but also environmentally responsible. 
          </p>
        </div>

        <div className="mx-auto max-w-3xl px-6 mt-16">
          <h2 className="text-5xl font-extrabold text-gray-900">Our Focus</h2>
          <p className="mt-6 text-gray-700 leading-relaxed">
            Western Cyber Society is dedicated to cultivating the next generation of tech leaders by focusing on excellence in key sectors such as cybersecurity, artificial intelligence, and data science. 
            We provide students with hands-on experience, mentorship, and cutting-edge resources to help them thrive in the rapidly evolving world of technology.
          </p>
        </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 px-20'>
            <div className='flex flex-col items-center'>
              <img
                src='/ai.jpg'
                alt='Artificial Intelligence'
                className='w-24 h-24 object-cover rounded-full mb-4'
              />
              <h3 className='text-2xl font-semibold text-gray-800'>Artificial Intelligence (AI)</h3>
              <p className='mt-2 text-gray-600 text-center'>
                From expressive NLP models to adaptive machine learning algorithms, current developments in AI offer us an exciting glimpse into a new paradigm of how we will use and develop software in the near future.The Western Cyber Society&apos;s goal is to offer students a stepping-off point into this fascinating, complex, and ever-evolving field so they can better prepare themselves for their careers.To that end, we are excited to offer various workshops and events where students can build their skills.
              </p>
            </div>

            <div className='flex flex-col items-center'>
              <img
                src='/cs.jpg'
                alt='Cyber Security'
                className='w-24 h-24 object-cover rounded-full mb-4'
              />
              <h3 className='text-2xl font-semibold text-gray-800'>Cyber Security</h3>
              <p className='mt-2 text-gray-600 text-center'>
                Our team&apos;s primary goal is to impart exceptional knowledge by harnessing prevalent industry technologies. This equips our members with indispensable hands-on experience in these domains. Additionally, we are committed to delivering practical insights through diverse projects and events throughout the year, each centred around a distinct theme. We opted for WCS because it stands out as one of the best ways to venture into the dynamic field of cyber security, an opportunity uniquely presented by Western.
              </p>
            </div>

            <div className='flex flex-col items-center'>
              <img
                src='/web3.jpg'
                alt='Web3'
                className='w-24 h-24 object-cover rounded-full mb-4'
              />
              <h3 className='text-2xl font-semibold text-gray-800'>Web3</h3>
              <p className='mt-2 text-gray-600 text-center'>
                Amidst the escalating concerns surrounding data privacy, the concept of decentralizing data emerges as an increasingly validated solution, and its adoption is steadily on the rise. Our prime objective revolves around elevating consciousness and imparting technical proficiency to our members, enabling them to delve into the nascent realms of Web3. Over the course of the year, our unwavering focus will center on the conception and realization of a project that serves as a testament to the potent capabilities of Web3.
              </p>
            </div>
        </div>
      </div>

      {/* Image Carousel */}
      <div className='mx-10 mb-10'>
        <Slider {...settings}>
          <div>
            <img className='px-1' src='/overview.jpg' alt="Overview" />
          </div>
          <div>
            <img className='px-1' src='/overview.jpg' alt="Overview" />
          </div>
          <div>
            <img className='px-1' src='/overview.jpg' alt="Overview" />
          </div>
          <div>
            <img className='px-1' src='/overview.jpg' alt="Overview" />
          </div>
          <div>
            <img className='px-1' src='/overview.jpg' alt="Overview" />
          </div>
          <div>
            <img className='px-1' src='/overview.jpg' alt="Overview" />
          </div>
        </Slider>
      </div>

      <Footer />
    </div>
  )
}
