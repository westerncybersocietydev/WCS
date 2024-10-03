"use client"
import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { getMyEvents } from '../lib/actions/user.action';
import { EventObject } from '../lib/actions/event.action';
import { useUser } from '../context/UserContext';

export default function MyEvents() {
  const { user, fetchUser } = useUser();
  const [rsvpEvents, setRsvpEvents] = useState<EventObject[]>([]);
  const [selectedItem, setSelectedItem] = useState<EventObject | null>(null);

  const getProfileData = useCallback(async () => {
    if (!user?.userId) {
      console.log("Error getting user id.");
      return;
    }

    const eventResponse = await getMyEvents(user?.userId);
    setRsvpEvents(eventResponse);
  }, [user?.userId, fetchUser]);

  const openModal = (item: EventObject) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  useEffect(() => {
    getProfileData();
  }, [getProfileData]);

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

const isEventPassed = (eventDate: string) => {
  const eventDateObj = new Date(eventDate);
  const currentDate = new Date();
  return eventDateObj < currentDate;
};

  return (
    <div>
      <Navbar />

      <div className='mt-40 md:mt-30 mx-10 min-h-screen'>
        <h2 className="text-4xl font-bold text-gray-800 mb-5">My Events</h2>
        <div className='flex flex-wrap ml-5'>
        {rsvpEvents.length === 0 ? (
          <div className="flex justify-center items-center h-screen text-center m-auto text-gray-600 p-4">
            <p>No RSVP&apos;d events found.</p>
          </div>
        ) : (
          rsvpEvents.map((item, index) => (
            <div
              key={index}
              className="w-full md:w-1/3 flex-shrink-0 p-3 relative group cursor-pointer"
              onClick={() => openModal(item)}
            >
              <div className="relative h-[70vw] md:h-[40vw] 3xl:h-[30vw] mb-10 overflow-hidden rounded-sm shadow-lg transition-transform transform group-hover:scale-105">
                <img
                  src={item.image}
                  alt={item.name}
                  className={`w-full h-2/5 md:h-2/4 object-cover rounded-t-xl ${
                    isEventPassed(item.date) ? "filter grayscale" : ""
                  }`}
                />
                <div className="h-3/5 md:h-2/4 bg-white rounded-b-xl p-4">
                  <h2 className="text-lg md:text-xl 2xl:text-2xl text-gray-800 font-bold mb-1">{item.name}</h2>
                  <p className="text-sm md:text-base 2xl:text-lg text-gray-600 font-semibold mb-1">{item.date}</p>
                  <p className="text-sm md:text-base 2xl:text-lg text-gray-600 mb-1">{item.location}</p>
                  <p className="text-sm md:text-base 2xl:text-lg text-gray-800">
                    {item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description}
                  </p>
                </div>
                <div className="absolute bottom-[-30px] right-4 font-semibold transition-all duration-700 ease-in-out group-hover:bottom-2">
                  <span className='text-sm text-gray-800 font-semibold'>View Details <i className="fa-solid fa-arrow-right"></i></span>
                </div>
              </div>
            </div>
          ))
        )}
        </div>
      </div>

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

              <div className="md:w-2/3 h-2/3 md:h-full p-2 md:p-5 w-full flex flex-col justify-between">
                <div className='px-2 text-gray-800'>
                  <h2 className="text-xl md:text-4xl font-bold mb-2">{selectedItem.name}</h2>
                  <p className="text-gray-600 ml-2 mb-2 text-xs tracking-wide">Already RSVP&apos;d</p>
                  <p className="font-semibold ml-2 text-sm md:text-base mb-1"><i className="fa-solid fa-calendar-days"></i><span className='ml-2 font-normal text-gray-700'>{selectedItem.date} at {selectedItem.time}</span></p>
                  <p className="font-semibold ml-2 text-sm md:text-base mb-1"><i className="fa-solid fa-location-dot"></i><span className='ml-2 font-normal text-gray-700'>{selectedItem.location}</span></p>
                  <p className="font-semibold ml-2 text-sm md:text-base mb-3"><i className="fa-solid fa-tag"></i><span className='ml-2 font-normal text-gray-700'>{selectedItem.price}</span></p>
                  <p className="font-normal text-gray-700 ml-2 max-w-lg text-sm md:text-base mb-2 leading-relaxed">{selectedItem.description}</p>
                </div>

                <div className="flex items-center text-center justify-center md:justify-end space-x-4 md:mr-5">
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
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
