import React, { useState } from 'react';

interface CarouselItem {
  name: string;
  image: string;
  time: string;
  price: string;
  location: string;
  description: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<CarouselItem | null>(null); // Modal state
  const itemsToShow = 3;
  const totalItems = items.length;

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (totalItems - itemsToShow + 1));
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + (totalItems - itemsToShow + 1)) % (totalItems - itemsToShow + 1)
    );
  };

  const openModal = (item: CarouselItem) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="mx-10 flex flex-col">
      <div className="flex px-5 mt-10 mb-5 items-start">
        <h2 className="text-2xl font-semibold">
          <strong>Upcoming Events</strong>
        </h2>
        <div className="flex space-x-4 ml-auto">
          <button
            onClick={goToPrev}
            className="text-black border border-gray-400 px-4 py-2 rounded-full shadow-lg transition-transform transform hover:scale-110 hover:shadow-xl"
            aria-label="Previous"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            onClick={goToNext}
            className="text-black border border-gray-400 px-4 py-2 rounded-full shadow-lg transition-transform transform hover:scale-110 hover:shadow-xl"
            aria-label="Next"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="w-fit h-full overflow-hidden flex items-center justify-center">
        <div className="relative overflow-hidden flex-grow">
          <div
            className="flex transition-transform duration-700 ease-in-out items-center"
            style={{ transform: `translateX(-${(currentIndex * 100) / itemsToShow}%)` }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="w-1/3 flex-shrink-0 p-3 relative group cursor-pointer"
                onClick={() => openModal(item)}
              >
                <div className="relative mb-10 overflow-hidden rounded-sm shadow-lg transition-transform transform group-hover:scale-105">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-1/4 object-cover rounded-t-lg"
                  />
                  <div className="p-4 h-[18vw] bg-white rounded-b-lg">
                    <h2 className="text-xl font-bold mb-1">{item.name}</h2>
                    <p className="text-gray-600 font-semibold mb-1">{item.time}</p>
                    <p className="text-gray-600 mb-1">{item.location}</p>
                    <p className="text-gray-800">
                        {item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description}
                    </p>
                  </div>

                {/* View Details overlay on hover */}
                <div className="absolute bottom-[-30px] right-4 font-semibold transition-all duration-700 ease-in-out group-hover:bottom-2">
                    <span className='text-sm font-semibold'>View Details <i className="fa-solid fa-arrow-right"></i></span>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    {/* Modal */}
    {selectedItem && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
        <div className="relative rounded-lg w-4/5 m-auto flex">
        
        {/* Close Button */}
        <button onClick={closeModal} className="absolute top-2 right-2 p-2 text-black transition-all duration-500 hover:scale-110">
            <i className="fa-solid fa-x text-xl"></i>
        </button>
        
        <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Left Side: Image */}
            <div className="lg:w-1/3 w-full">
                <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
                />
            </div>

            {/* Right Side: Content */}
            <div className="lg:w-2/3 p-5 mt-5 w-full py-5 flex flex-col justify-between">
                <div className='px-3'>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">{selectedItem.name}</h2>
                <p className="font-semibold ml-2 text-base mb-2">Time: <span className='font-normal text-gray-700'>{selectedItem.time}</span></p>
                <p className="font-semibold ml-2 text-base mb-2">Location: <span className='font-normal text-gray-700'>{selectedItem.location}</span></p>
                <p className="font-semibold ml-2 text-base mb-2">Price: <span className='font-normal text-gray-700'>{selectedItem.price}</span></p>
                <p className="font-semibold ml-2 text-base mb-2 leading-relaxed">Description: <span className='font-normal text-gray-700'>{selectedItem.description}</span></p>
                </div>
                
                {/* RSVP Button */}
                <button className="self-end mr-5 text-xs z-40 text-gray-950 border border-gray-700 rounded-full hover:scale-110 bg-violet-400 hover:bg-violet-950 hover:text-white py-2 px-4 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg">
                RSVP
                </button>
            </div>
            </div>

        </div>
    </div>
    )}
        </div>
  );
};

export default Carousel;
