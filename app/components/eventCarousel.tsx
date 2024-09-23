import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import CheckoutForm from '../components/checkoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { EventObject, getAllEvents } from '../lib/actions/event.action';
import { eventRSVP, getMyEvents } from '../lib/actions/user.action';
import { useUser } from '../context/UserContext';
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

const Carousel: React.FC = () => {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [rsvpEvents, setRsvpEvents] = useState<EventObject[]>([]);
  const [selectedItem, setSelectedItem] = useState<EventObject | null>(null);
  const [isRSVPModalOpen, setRSVPModalOpen] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [events, setEvents] = useState<EventObject[]>([]); // State to store events
  const [state, setState] = useState({
    currentIndex: 0,
    rsvpEvents: [],
    events: [],
    totalItems: 0,
    loading: false,
    itemsToShow: 1,
  });

  async function fetchRSVPEvents() {
    try {
      if (user?.userId) {
      const eventData = await getMyEvents(user?.userId); // Call the API to get events
      setRsvpEvents(eventData); // Set the fetched events to state
    }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  const updateItemsToShow = useCallback(() => {
    if (window.innerWidth >= 768) {
      setItemsToShow(3);
    } else {
      setItemsToShow(1);
    }
  }, []);
  
  useEffect(() => {
    const debouncedUpdate = debounce(updateItemsToShow, 200); // Debounce for 200ms
    window.addEventListener('resize', debouncedUpdate);
    updateItemsToShow(); // Set initial value
  
    return () => window.removeEventListener('resize', debouncedUpdate);
  }, [updateItemsToShow]);
  

  const getProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const eventData = await getAllEvents();
      setEvents(eventData);
      setTotalItems(eventData.length);
  
      // Call getMyEvents only if userId is not null
      if (user?.userId) {
        const rsvpData = await getMyEvents(user.userId);
        setRsvpEvents(rsvpData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);
  
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
      toast.success("You have successfully RSVP'd")
      await getProfileData();
    } catch (error) {
      console.error("Error RSVPing for event:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if an event is already RSVP'd

  // Utility function to convert 12-hour time format (e.g., 7:00PM) to 24-hour format
  const convertTo24HourFormat = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let updatedhours = hours;

    if (modifier === 'PM' && hours !== 12) {
      updatedhours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      updatedhours = 0;
    }

    return `${updatedhours}:${minutes.toString().padStart(2, '0')}`;
  };

  // Utility functions to format date and time for Google Calendar links
  const formatDateTimeForGoogle = (dateStr: string, timeStr: string) => {
    try {
      const [, month, day, year] = dateStr.split(" ");
      const fullDateStr = `${month} ${day}, ${year} ${timeStr}`;
      
      // Create a new Date object in the user's local time zone
      const date = new Date(fullDateStr);
  
      // Format it as YYYYMMDDTHHmmss without time zone (local time)
      const yearPart = date.getFullYear();
      const monthPart = String(date.getMonth() + 1).padStart(2, '0');
      const dayPart = String(date.getDate()).padStart(2, '0');
      const hoursPart = String(date.getHours()).padStart(2, '0');
      const minutesPart = String(date.getMinutes()).padStart(2, '0');
      const secondsPart = String(date.getSeconds()).padStart(2, '0');
  
      return `${yearPart}${monthPart}${dayPart}T${hoursPart}${minutesPart}${secondsPart}`;
    } catch (error) {
      console.error("Invalid Google Calendar Date/Time:", error);
      return '';
    }
  };
  
  const googleUrl = (event: EventObject) => {
    const startDateTime = formatDateTimeForGoogle(event.date, event.time);
    
    // Assuming the event lasts 1 hour (adjust as needed)
    const startTime = new Date(`${event.date} ${event.time}`);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);
  
    // Formatting end time similarly
    const endDateTime = formatDateTimeForGoogle(endTime.toDateString(), endTime.toTimeString().split(' ')[0]);
  
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startDateTime}/${endDateTime}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description)}`;
  };
  

// Function to convert date and time to ISO format for Outlook
const formatDateTimeForOutlook = (dateStr: string, timeStr: string) => {
  try {
    const [, month, day, year] = dateStr.split(" ");
    const time24Hour = convertTo24HourFormat(timeStr); // Convert to 24-hour format
    const fullDateStr = `${month} ${day}, ${year} ${time24Hour}`;
    const startDate = new Date(fullDateStr);

    // Format start time for Outlook
    const startdt = startDate.toISOString(); // YYYY-MM-DDTHH:MM:SS

    // Set end time by adding the event duration (in hours)
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // Add duration to the start date
    const enddt = endDate.toISOString(); // YYYY-MM-DDTHH:MM:SS

    return { startdt, enddt };
  } catch (error) {
    console.error("Invalid Outlook Calendar Date/Time:", error);
    return { startdt: '', enddt: '' };
  }
};

const outlookUrl = (event : EventObject) => {
  const { startdt, enddt } = formatDateTimeForOutlook(event.date, event.time); // Assuming event is 2 hours long
  return `https://outlook.live.com/calendar/action/compose?subject=${encodeURIComponent(event.name)}&startdt=${startdt}&enddt=${enddt}&location=${encodeURIComponent(event.location)}&body=${encodeURIComponent(event.description)}`;
};

const isEventRSVPd = useMemo(() => (eventId: string) => {
  return rsvpEvents.some(event => event.id === eventId);
}, [rsvpEvents]);

const isEventPassed = useMemo(() => (eventDate: string) => {
  const eventDateObj = new Date(eventDate);
  const currentDate = new Date();
  return eventDateObj < currentDate;
}, []);


  // RSVP Modal Component
  const RSVPModal: React.FC<{ onClose: () => void; onRSVP: (userId: string, eventId: string) => void; item: EventObject | null; }> = ({ onClose, onRSVP, item }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity z-50">
      <div className="relative w-full md:w-3/5 h-full px-2 py-10 flex justify-center">
        {item?.price === "Free" ? (
          <div className="flex flex-col p-6 bg-white w-10/12 space-y-4 p-5 shadow rounded-lg">
            <h1 className="text-lg tracking-wide text-center text-gray-900">
              Are you sure you want to RSVP for <span className="font-bold">{item?.name}</span>?
            </h1>
            <div className="flex justify-center text-sm space-x-4">
              <button 
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all"
                onClick={() => onRSVP(user?.userId || '', item.id)}
                disabled={loading}
              >
                Yes, I will attend!
              </button>
              <button 
                className="px-6 py-2 bg-red-500 text-white font-medium rounded-full hover:bg-red-700 transition-all"
                onClick={onClose}
                disabled={loading}
              >
                Nevermind
              </button>
            </div>
          </div>
        ) : (
          <div className='bg-white px-5 py-3 rounded relative'>
            <button onClick={onClose} className="absolute bg-white px-2 top-3 right-5 text-gray-700 transition-transform duration-300 hover:scale-110 focus:outline-none">
              <i className="fa-solid fa-x text-lg"></i>
            </button>
            <h1 className="text-lg md:text-4xl tracking-wide font-bold text-center text-gray-800">RSVP for Event</h1>
            <div className="flex mx-3 flex-row items-start h-full overflow-y-auto custom-scrollbar">
              {/* Left Side */}
              <div className="w-2/5 mt-14">
                <img
                  src={item?.image}
                  alt={item?.name}
                  className="w-full h-[15vw] object-cover shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)] shadow-gray-300"
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
              <div className="w-3/5 p-2 flex flex-col items-center">
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
    <div className="mx-auto w-full flex flex-col">
      <div className="flex px-5 mt-10 mb-5 items-start">
        <h2 className="text-4xl font-bold text-gray-800 mb-5">Upcoming Events</h2>
        <div className="flex space-x-4 ml-5 md:ml-auto">
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

      <div className="w-full h-full overflow-hidden flex items-center justify-center">
        <div className="relative overflow-hidden flex-grow">
          <div
            className="flex transition-transform duration-700 ease-in-out items-center"
            style={{ transform: `translateX(-${(currentIndex * 100) / itemsToShow}%)` }}
          >
            {events.map((item, index) => (
              <div
                key={index}
                className="w-full md:w-1/3 flex-shrink-0 p-3 relative group cursor-pointer"
                onClick={() => openModal(item)}
              >
                <div className="relative h-[70vw] md:h-[40vw] 3xl:h-[30vw] mb-10 overflow-hidden rounded-sm shadow-lg transition-transform transform group-hover:scale-105">
                  <img
                    loading="lazy"
                    src={item.image}  
                    alt={item.name}
                    className={`w-full h-2/5 md:h-2/4 object-cover rounded-t-xl ${
                      isEventPassed(item.date) ? "filter grayscale" : ""
                    }`}
                  />
                  <div className="h-3/5 md:h-2/4 p-4 bg-white rounded-b-xl">
                    <h2 className="text-lg md:text-xl 2xl:text-2xl text-gray-800 font-bold mb-1">{item.name}</h2>
                    <p className="text-sm md:text-base 2xl:text-lg text-gray-600 font-semibold mb-1">{item.date}</p>
                    <p className="text-sm md:text-base 2xl:text-lg text-gray-600 mb-1">{item.location}</p>
                    <p className="text-sm md:text-base 2xl:text-lg text-gray-800">
                      {item.description.length > 150 ? item.description.substring(0, 150) + '...' : item.description}
                    </p>
                  </div>

                  {/* View Details overlay on hover */}
                  <div className="absolute bottom-[-30px] right-4 font-semibold transition-all duration-700 ease-in-out group-hover:bottom-2">
                    <span className='text-sm text-gray-800 font-semibold'>View Details <i className="fa-solid fa-arrow-right"></i></span>
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
          <div className="relative rounded-lg w-5/6 h-full md:h-2/3 py-2 m-auto flex">
            {/* Close Button */}
            <button onClick={closeModal} className="absolute top-3 right-2 p-2 text-white md:text-black transition-all duration-500 hover:scale-110">
              <i className="fa-solid fa-x text-xl"></i>
            </button>
            <div className="flex flex-col lg:flex-row bg-white w-full rounded-lg shadow-lg overflow-hidden">
              {/* Left Side: Image */}
              <div className="md:w-1/3 h-1/3 md:h-full w-full">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Right Side: Content */}
              <div className="md:w-2/3 h-2/3 md:h-full p-5 w-full py-5 flex flex-col justify-between">
                <div className='px-2 text-gray-800'>
                  <h2 className="text-xl md:text-4xl 2xl:text-6xl font-bold mb-2">{selectedItem.name}</h2>
                  {isEventRSVPd(selectedItem.id) && <p className="text-gray-600 ml-2 mb-2 text-xs tracking-wide">Already RSVP&apos;d</p>}
                  <p className="font-semibold ml-2 text-sm md:text-base 2xl:text-xl mb-1"><i className="fa-solid fa-calendar-days"></i><span className='ml-2 font-normal text-gray-700'>{selectedItem.date} at {selectedItem.time}</span></p>
                  <p className="font-semibold ml-2 text-sm md:text-base 2xl:text-xl mb-1"><i className="fa-solid fa-location-dot"></i><span className='ml-2 font-normal text-gray-700'>{selectedItem.location}</span></p>
                  <p className="font-semibold ml-2 text-sm md:text-base 2xl:text-xl mb-3"><i className="fa-solid fa-tag"></i><span className='ml-2 font-normal text-gray-700'>{selectedItem.price}</span></p>
                  <p className="font-normal text-gray-700 ml-2 max-w-lg text-sm md:text-base 2xl:text-xl mb-2 leading-relaxed">{selectedItem.description}</p>
                </div>

                {isEventRSVPd(selectedItem.id) ? (
                <div className="flex items-center justify-end space-x-4 mr-5">
                {/* Add to Outlook Calendar Button */}
                <a
                  href={outlookUrl(selectedItem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs z-40 text-white rounded-full py-2 px-4 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-700 hover:to-blue-800 hover:scale-105"
                >
                  Add to Outlook Calendar
                </a>

                {/* Add to Google Calendar Button */}
                <a
                  href={googleUrl(selectedItem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs z-40 text-white rounded-full py-2 px-4 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg bg-gradient-to-r from-rose-400 to-red-500 hover:from-rose-600 hover:to-red-700 hover:scale-105"
                >
                  Add to Google Calendar
                </a>
              </div>
                ) : (
                  <button
                  onClick={openRSVPModal} // Disable button if RSVP'd
                  className={`hidden self-end mr-5 text-xs z-40 text-white tracking-wide rounded-full bg-violet-500 hover:bg-violet-950 hover:text-white py-2 px-6 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg`}
                  disabled={isEventPassed(selectedItem.date)} // Disable button
                >
                  RSVP
                </button>
                )}


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
