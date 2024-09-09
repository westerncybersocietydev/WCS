"use client"
import React from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Events() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      <Navbar />
      <div className='text-black'>
      
      {/* Image Carousel */}
      <div className='mb-10'>
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

      </div>
      <Footer />
    </div>
  )
}
