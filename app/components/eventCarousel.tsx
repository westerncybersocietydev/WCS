import React, { useCallback, useEffect, useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import CheckoutForm from '../components/checkoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { EventObject } from '../lib/actions/event.action';
import { eventRSVP, getMyEvents } from '../lib/actions/user.action';
import { useUser } from '../context/UserContext';
import { useRouter } from "next/navigation";

interface CarouselProps {
  items: EventObject[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [rsvpEvents, setRsvpEvents] = useState<EventObject[]>([]);
  const [selectedItem, setSelectedItem] = useState<EventObject | null>(null);
  const [isRSVPModalOpen, setRSVPModalOpen] = useState(false);
  const { user, fetchUser } = useUser();
  const [loading, setLoading] = useState(false);
  const itemsToShow = 3;
  const totalItems = items.length;

  const getProfileData = useCallback(async () => {
    if (!user?.userId) {
      console.log("Error getting user id.");
      return;
    }

    const eventResponse = await getMyEvents(user?.userId);
    setRsvpEvents(eventResponse)

  }, [user?.userId, fetchUser]);

  useEffect(() => {
    getProfileData();
  }, [getProfileData]);

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: 15 * 100,
    currency: 'cad',
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (totalItems - itemsToShow + 1));
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + (totalItems - itemsToShow + 1)) % (totalItems - itemsToShow + 1)
    );
  };

  const openModal = (item: EventObject) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const openRSVPModal = () => {
    if (!user?.userId) {
      router.push("/sign-up")
      return
    }

    setRSVPModalOpen(true);
  };

  const closeRSVPModal = () => {
    setRSVPModalOpen(false);
  };

  const handleRSVP = async (userId: string, eventId: string): Promise<void> => {
    if (!user?.userId) {
      router.push("/sign-up")
    }

    setLoading(true);
    try {
      await eventRSVP(userId, eventId);
      closeRSVPModal();
      closeModal();
      await getProfileData();
    } catch (error) {
      console.error("Error RSVPing for event:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if an event is already RSVP'd
  const isEventRSVPd = (eventId: string) => {
    return rsvpEvents.some(event => event.id === eventId);
  };

  // RSVP Modal Component
  const RSVPModal: React.FC<{ onClose: () => void; onRSVP: (userId: string, eventId: string) => void; item: EventObject | null; }> = ({ onClose, onRSVP, item }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity z-50">
      <div className="relative w-3/5 flex justify-center">
        {item?.price === "Free" ? (
          <div className="flex flex-col p-6 bg-white w-10/12 space-y-4 p-5 shadow rounded-lg">
            <h1 className="text-lg tracking-wide text-center text-gray-900">
              Are you sure you want to RSVP for <span className="font-bold">{item?.name}</span>?
            </h1>
            <div className="flex justify-center text-sm space-x-4">
              <button 
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all"
                onClick={() => onRSVP(user?.userId || '', item.id)}
              >
                Yes, I will attend!
              </button>
              <button 
                className="px-6 py-2 bg-red-500 text-white font-medium rounded-full hover:bg-red-700 transition-all"
                onClick={onClose}
              >
                Nevermind
              </button>
            </div>
          </div>
        ) : (
          <div className='bg-white px-5 py-3 rounded'>
            <button onClick={onClose} className="absolute bg-white px-2 top-2 right-2 text-gray-700 transition-transform duration-300 hover:scale-110 focus:outline-none">
              <i className="fa-solid fa-x text-xs"></i>
            </button>
            <h1 className="text-4xl tracking-wide font-bold text-center text-gray-800">RSVP for Event</h1>
            <div className="flex mx-3 flex-row items-start h-3/4 overflow-hidden">
              {/* Left Side */}
              <div className="w-2/5 mt-14">
                <img
                  src={item?.image}
                  alt={item?.name}
                  className="w-full object-cover shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)] shadow-gray-300"
                />
                <h2 className='text-black text-lg font-bold ml-2 mt-5'>{item?.name}</h2>
                <h2 className='text-gray-800 text-xs font-semibold ml-2 mt-1'>
                  <i className="fa-solid fa-calendar-days"></i> {item?.date} at {item?.time}
                </h2>
                <h2 className='text-gray-800 text-xs font-semibold ml-2 mt-1'>
                  <i className="fa-solid fa-location-dot"></i> {item?.location}
                </h2>
                <h2 className='text-gray-800 text-xs font-semibold ml-2 mt-1'>
                  <i className="fa-solid fa-tag"></i> {item?.price}
                </h2>
              </div>
              
              {/* Divider */}
              <div className="w-px ml-10 mt-20 h-[24vw] bg-gray-800 mx-2"></div>
              
              {/* Right Side: Content */}
              <div className="w-3/5 p-5 flex flex-col items-center">
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm planPrice={15} onPaymentSuccess={() => handleRSVP(user?.userId || '', item?.id || '')} />
                </Elements>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mx-10 flex flex-col">
      <div className="flex px-5 mt-10 mb-5 items-start">
        <h2 className="text-4xl font-bold text-gray-800 mb-5">Upcoming Events</h2>
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
                    <p className="text-gray-600 font-semibold mb-1">{item.date}</p>
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

      {/* Modal for Selected Item */}
      {selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
          <div className="relative rounded-lg w-4/5 m-auto flex">
            {/* Close Button */}
            <button onClick={closeModal} className="absolute top-2 right-2 p-2 text-black transition-all duration-500 hover:scale-110">
              <i className="fa-solid fa-x text-xl"></i>
            </button>
            <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Left Side: Image */}
              <div className="lg:w-1/3 w-full">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Right Side: Content */}
              <div className="lg:w-2/3 p-5 w-full py-5 flex flex-col justify-between">
                <div className='px-3'>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">{selectedItem.name}</h2>
                  <p className="font-semibold ml-2 text-base mb-1"><i className="fa-solid fa-calendar-days"></i><span className='ml-2 font-normal text-gray-700'>{selectedItem.date} at {selectedItem.time}</span></p>
                  <p className="font-semibold ml-2 text-base mb-1"><i className="fa-solid fa-location-dot"></i><span className='ml-2 font-normal text-gray-700'>{selectedItem.location}</span></p>
                  <p className="font-semibold ml-2 text-base mb-3"><i className="fa-solid fa-tag"></i><span className='ml-2 font-normal text-gray-700'>{selectedItem.price}</span></p>
                  <p className="font-normal text-gray-700 ml-2 max-w-lg text-base mb-2 leading-relaxed">{selectedItem.description}</p>
                </div>
                <button
                    onClick={isEventRSVPd(selectedItem.id) ? undefined : openRSVPModal} // Disable button if RSVP'd
                    className={`self-end mr-5 text-xs z-40 text-gray-950 border border-gray-700 rounded-full ${isEventRSVPd(selectedItem.id) ? "bg-gray-300 cursor-not-allowed" : "bg-violet-400 hover:bg-violet-950 hover:text-white"} py-2 px-4 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg`}
                    disabled={isEventRSVPd(selectedItem.id)} // Disable button
                  >
                    {isEventRSVPd(selectedItem.id) ? "Already RSVP'd" : "RSVP"}
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RSVP Modal */}
      {isRSVPModalOpen && selectedItem && (
        <RSVPModal
          onClose={closeRSVPModal}
          onRSVP={(userId: string, eventId: string) => handleRSVP(userId, eventId)}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default Carousel;
