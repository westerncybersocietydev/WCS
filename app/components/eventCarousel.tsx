import React, { useCallback, useEffect, useState } from 'react';
import { EventObject, getAllEvents } from '../lib/actions/event.action';
import { eventRSVP } from '../lib/actions/user.action';
import { useUser } from '../context/UserContext';
import { useRouter, usePathname } from "next/navigation";
import toast from 'react-hot-toast';
import { motion } from "framer-motion"
import Image from 'next/image';

const activeEvents = [
  "IBM NIGHT"
]

const Carousel: React.FC = () => {
  const router = useRouter();
  const pathName = usePathname();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<EventObject | null>(null);
  const [isRSVPModalOpen, setRSVPModalOpen] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [events, setEvents] = useState<EventObject[]>([]);
  const [isPaid, setIsPaid] = useState(false);

  const updateItemsToShow = () => {
    if (window.innerWidth >= 768) { // Adjust the width as needed for 'md'
      setItemsToShow(3);
    } else {
      setItemsToShow(1); // or however many you want for smaller screens
    }
  };

  useEffect(() => {
    updateItemsToShow(); // Set initial value
    window.addEventListener('resize', updateItemsToShow); // Listen for resize

    return () => {
      window.removeEventListener('resize', updateItemsToShow); // Cleanup on unmount
    };
  }, []);

  const getProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const eventData = await getAllEvents(user?.userId);
      setEvents(eventData);
      setTotalItems(eventData.length);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);
  
  useEffect(() => {
    getProfileData();
  }, [getProfileData]);
  
  useEffect(() => {
    if (selectedItem?.isRsvp) {
      // Optionally re-fetch the event data if necessary after RSVP
      getProfileData();
    }
  }, [selectedItem?.isRsvp]);

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
      // Pass the current route as a query parameter to the sign-up page
      router.push(`/sign-up?redirect=${encodeURIComponent(pathName)}`);
      return;
    }
    setRSVPModalOpen(true);
  };

  const closeRSVPModal = () => {
    setRSVPModalOpen(false);
  };

  const handleRSVP = async (userId: string, eventId: string): Promise<void> => {
    if (!user?.userId) {
      router.push("/sign-up");
      return;
    }
  
    setLoading(true);
    try {
      await eventRSVP(userId, eventId);
      await getProfileData();
  
      closeRSVPModal()
      closeModal()
      toast.success("You have successfully RSVP'd");
    } catch (error) {
      console.error("Error RSVPing for event:", error);
    } finally {
      setLoading(false);
    }
  };  

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

const handleCheckboxChange = () => {
  setIsPaid(!isPaid);
};

  // RSVP Modal Component
  const RSVPModal: React.FC<{ onClose: () => void; onRSVP: (userId: string, eventId: string) => void; item: EventObject | null; }> = ({ onClose, onRSVP, item }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity z-50">
      <div className="relative w-full h-full px-2 py-1 flex items-center justify-center">
        {item?.price == "Free" ? (
        <div className='md:w-3/5'>
          <div className="flex flex-col p-6 bg-white w-10/12 space-y-4 p-5 shadow rounded-lg">
            <h1 className="text-lg tracking-wide text-center text-gray-900">
              Are you sure you want to RSVP for <span className="font-bold">{item?.name}</span>? If you are not a VIP member, you will be required to pay an admission fee.
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
        </div>
        ) : (
          <div className='bg-white px-5 py-5 w-full md:w-3/5 md:rounded relative max-h-full m-auto overflow-y-auto lg:overflow-hidden custom-scrollbar'>
            <button onClick={onClose} className="absolute bg-white px-2 top-3 right-5 text-gray-700 transition-transform duration-300 hover:scale-110 focus:outline-none m-auto">
              <i className="fa-solid fa-x text-lg"></i>
            </button>
            <h1 className="text-sm md:text-3xl tracking-wide font-bold text-center text-gray-800 mb-5">RSVP for {item?.name}</h1>


            <div className="flex flex-col h-full space-y-4 px-4 md:px-12">
              <div className="flex items-center">
                <h1 className="text-4xl font-bold mr-4">1</h1>
                <p className="text-xs md:text-sm ml-12">
                  Send an e-transfer with <strong>Your Full Name | Number of Tickets You Are Purchasing in the Transfer Description</strong> to the following email: <a href="mailto:unsalalp10@gmail.com" className="text-blue-500 hover:underline">unsalalp10@gmail.com</a>.
                  ($15 / ticket)
                </p>
              </div>
              <div className="flex items-center">
                <h1 className="text-4xl font-bold mr-4">2</h1>
                <p className="text-xs md:text-sm ml-12 ">
                  Complete your RSVP by following the rest of the steps below.
                </p>
              </div>
              <div className="flex items-center">
                <h1 className="text-4xl font-bold mr-4">3</h1>
                <p className="text-xs md:text-sm ml-12 ">
                  Await a confirmation email to confirm the successful e-transfer and completion of registration.
                </p>
              </div>
              <div className="flex items-center">
                <h1 className="text-4xl font-bold mr-4">4</h1>
                <p className="text-xs md:text-sm ml-12">
                  You’re all set! Pick up your ticket on November 10 or 11 between 10:00 am and 3:00 pm.
                </p>
              </div>

              <div>
                <label className='mt-5' style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={handleCheckboxChange}
                  />
                  <span className='ml-5 cursor-pointer' style={{ fontSize: '12px' }}>
                    I confirm that I have completed the e-transfer as outlined above, including providing accurate details. I understand that my registration is not finalized until the transfer is verified and that I am responsible for ensuring the correct amount is sent.
                  </span>
                </label>

                <button
                  className='w-full cursor-pointer mt-3 rounded-xl text-white font-bold bg-gradient-to-r from-violet-500 to-purple-500 border hover:bg-blue-800 hover:text-white text-xs md:text-sm py-2 md:py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg'
                  onClick={() => onRSVP(user?.userId || '', item?.id || '')}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Complete Event Registration'}
              </button>
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
        <motion.h2 
      initial={ { opacity: 0, } }
      whileInView={ { opacity: 1 } }
      viewport={ { margin: '-100px', once: true } } 
        className="text-4xl font-bold text-gray-800 mb-5">Upcoming Events</motion.h2>
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
                <div className="relative h-[70vw] md:h-[60vw] lg:h-[50vw] xl:h-[40vw] mb-10 overflow-hidden rounded-sm shadow-lg transition-transform transform group-hover:scale-105">
                <div className={`relative w-full h-2/5 md:h-2/4 overflow-hidden rounded-t-xl`}>
                    <Image
                      loading="lazy" // Next.js Image component supports lazy loading by default
                      src={item.image} // Ensure this path is correct
                      alt={item.name} // Ensure this is the correct alt text
                      layout="fill" // Makes the image fill the container
                      objectFit="cover" // Ensures the image covers the container
                    />
                  </div>
                  <div className="h-3/5 md:h-2/4 p-5 bg-white rounded-b-xl">
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
            <div className="flex flex-col md:flex-row bg-white w-full sm:rounded-lg shadow-lg overflow-y-auto custom-scrollbar">
              {/* Left Side: Image */}
              <div className="h-1/2 w-full md:w-1/3 md:h-full">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={selectedItem.image} // Ensure this path is correct
                  alt={selectedItem.name} // Ensure this is the correct alt text
                  layout="fill" // Makes the image fill the container
                  objectFit="cover" // Ensures the image covers the container
                />
                </div>
              </div>
              {/* Right Side: Content */}
              <div className="md:w-2/3 h-2/3 md:h-full p-2 md:p-5 w-full flex flex-col justify-between">
                <div className='px-2 text-gray-800'>
                  <h2 className="text-md md:text-4xl 2xl:text-6xl font-bold mb-2">{selectedItem.name}</h2>
                  {selectedItem.isRsvp && <p className="text-gray-600 ml-2 mb-2 text-xs tracking-wide">Already RSVP&apos;d</p>}
                  <p className="font-semibold ml-2 text-xs md:text-base 2xl:text-2xl mb-1"><i className="fa-solid fa-calendar-days"></i><span className='ml-2 font-normal text-gray-700'>{selectedItem.date} at {selectedItem.time}</span></p>
                  <p className="font-semibold ml-2 text-xs md:text-base 2xl:text-2xl mb-1"><i className="fa-solid fa-location-dot"></i><span className='ml-2 font-normal text-gray-700'>{selectedItem.location}</span></p>
                  <p className="font-semibold ml-2 text-xs md:text-base 2xl:text-2xl mb-3"><i className="fa-solid fa-tag"></i><span className='ml-2 font-normal text-gray-700'>{selectedItem.price}</span></p>
                  <p className="hidden md:block font-normal text-gray-700 ml-2 text-xs  md:text-base 2xl:text-2xl mb-2 leading-relaxed">{selectedItem.description}</p>
                </div>

                {
                  activeEvents.includes(selectedItem.name) ? (
                    selectedItem.isRsvp ? (
                      <div className="flex flex-col md:flex-row items-center text-center justify-end gap-2 md:gap-0 md:space-x-4 mr-5">
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
                      <div className='self-end p-2 md:p-0'>
                        <button
                          onClick={openRSVPModal}
                          className={`text-xs z-40 text-white tracking-wide rounded-full bg-violet-500 hover:bg-violet-950 hover:text-white py-1 px-4 md:py-2 md:px-6 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg`}
                        >
                          RSVP
                        </button>
                      </div>
                    )
                  ) : null
                }


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
