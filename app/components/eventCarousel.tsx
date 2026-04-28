import React, { Suspense, useCallback, useEffect, useState } from "react";
import { EventObject, getAllEvents } from "../lib/actions/event.action";
import { eventRSVP } from "../lib/actions/user.action";
import { useUser } from "../context/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Image from "next/image";

const activeEvents = ["VIP DINNER"];

export default function Carousel() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsComponent />
    </Suspense>
  );
}

const SearchParamsComponent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventRedirect = searchParams.get("event");

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
    if (window.innerWidth >= 768) {
      setItemsToShow(3);
    } else {
      setItemsToShow(1);
    }
  };

  useEffect(() => {
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);

    return () => {
      window.removeEventListener("resize", updateItemsToShow);
    };
  }, []);

  const openModal = useCallback((item: EventObject) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("event");

    router.replace(`?${newParams.toString()}`, { scroll: false });
    setSelectedItem(item);
  }, [searchParams, router]);

  const getProfileData = useCallback(async () => {
    try {
      setLoading(true);

      const eventData = await getAllEvents(user?.userId);
      const eventObj = eventData.find(
        (event) => event.name.toLowerCase() === eventRedirect?.toLowerCase()
      );
      eventObj && openModal(eventObj);
      setEvents(eventData);
      setTotalItems(eventData.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.userId, eventRedirect, openModal]);

  useEffect(() => {
    getProfileData();
  }, [getProfileData]);

  useEffect(() => {
    if (selectedItem?.isRsvp) {
      getProfileData();
    }
  }, [selectedItem?.isRsvp, getProfileData]);

  const goToNext = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % (totalItems - itemsToShow + 1)
    );
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + (totalItems - itemsToShow + 1)) %
        (totalItems - itemsToShow + 1)
    );
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const openRSVPModal = (eventName: string) => {
    if (!user?.userId) {
      router.push(
        `/sign-up?event=${encodeURIComponent("/events?event=" + eventName)}`
      );
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
      toast.success("You have successfully RSVP'd");
      await getProfileData();
      closeRSVPModal();
      closeModal();
    } catch (error) {
      console.error("Error RSVPing for event:", error);
    } finally {
      setLoading(false);
    }
  };

  // Utility function to convert 12-hour time format (e.g., 7:00PM) to 24-hour format
  const convertTo24HourFormat = (timeStr: string) => {
    const [time, modifier] = timeStr.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let updatedhours = hours;

    if (modifier === "PM" && hours !== 12) {
      updatedhours += 12;
    } else if (modifier === "AM" && hours === 12) {
      updatedhours = 0;
    }

    return `${updatedhours}:${minutes.toString().padStart(2, "0")}`;
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
      const monthPart = String(date.getMonth() + 1).padStart(2, "0");
      const dayPart = String(date.getDate()).padStart(2, "0");
      const hoursPart = String(date.getHours()).padStart(2, "0");
      const minutesPart = String(date.getMinutes()).padStart(2, "0");
      const secondsPart = String(date.getSeconds()).padStart(2, "0");

      return `${yearPart}${monthPart}${dayPart}T${hoursPart}${minutesPart}${secondsPart}`;
    } catch (error) {
      console.error("Invalid Google Calendar Date/Time:", error);
      return "";
    }
  };

  const googleUrl = (event: EventObject) => {
    const startDateTime = formatDateTimeForGoogle(event.date, event.time);

    const startTime = new Date(`${event.date} ${event.time}`);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    const endDateTime = formatDateTimeForGoogle(
      endTime.toDateString(),
      endTime.toTimeString().split(" ")[0]
    );

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.name
    )}&dates=${startDateTime}/${endDateTime}&location=${encodeURIComponent(
      event.location
    )}&details=${encodeURIComponent(event.description)}`;
  };

  // Function to convert date and time to ISO format for Outlook
  const formatDateTimeForOutlook = (dateStr: string, timeStr: string) => {
    try {
      const [, month, day, year] = dateStr.split(" ");
      const time24Hour = convertTo24HourFormat(timeStr);
      const fullDateStr = `${month} ${day}, ${year} ${time24Hour}`;
      const startDate = new Date(fullDateStr);

      // Format start time for Outlook
      const startdt = startDate.toISOString();

      // Set end time by adding the event duration (in hours)
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1);
      const enddt = endDate.toISOString();

      return { startdt, enddt };
    } catch (error) {
      console.error("Invalid Outlook Calendar Date/Time:", error);
      return { startdt: "", enddt: "" };
    }
  };

  const outlookUrl = (event: EventObject) => {
    const { startdt, enddt } = formatDateTimeForOutlook(event.date, event.time);
    return `https://outlook.live.com/calendar/action/compose?subject=${encodeURIComponent(
      event.name
    )}&startdt=${startdt}&enddt=${enddt}&location=${encodeURIComponent(
      event.location
    )}&body=${encodeURIComponent(event.description)}`;
  };

  const handleCheckboxChange = () => {
    setIsPaid(!isPaid);
  };

  // RSVP Modal Component
  const RSVPModal: React.FC<{
    onClose: () => void;
    onRSVP: (userId: string, eventId: string) => void;
    item: EventObject | null;
  }> = ({ onClose, onRSVP, item }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity z-50">
      <div className="relative w-full h-full px-2 py-1 flex items-center justify-center">
        {item?.price === "Free" || item?.price === "Free for VIP Members" ? (
          <div className="md:w-3/5 flex justify-center">
            <div className="flex flex-col p-6 bg-white w-10/12 space-y-4 p-5 shadow rounded-lg">
              <h1 className="text-lg tracking-wide text-center text-gray-900">
                Are you sure you want to RSVP for{" "}
                <span className="font-bold">{item?.name}</span>? If you are not
                a VIP member, you will be required to pay an admission fee.
              </h1>
              <div className="flex justify-center text-sm space-x-4">
                <button
                  className="px-6 cursor-pointer py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all"
                  onClick={() => onRSVP(user?.userId || "", item.id)}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Yes, I will attend!"}
                </button>
                <button
                  className="px-6 cursor-pointer py-2 bg-red-500 text-white font-medium rounded-full hover:bg-red-700 transition-all"
                  onClick={onClose}
                  disabled={loading}
                >
                  Nevermind
                </button>
              </div>
            </div>
          </div>
        ) : item?.price === "Free RSVP for VIP Members" ? (
          <div className="md:w-3/5 flex justify-center">
            <div className="flex flex-col p-6 bg-white w-10/12 space-y-4 p-5 shadow rounded-lg">
              <h1 className="text-lg tracking-wide text-center text-gray-900">
                Are you sure you want to RSVP for{" "}
                <span className="font-bold">{item?.name}</span>? If you are not
                a VIP member, you will need to buy membership at the door.
              </h1>
              <div className="flex justify-center text-sm space-x-4">
                <button
                  className="px-6 cursor-pointer py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all"
                  onClick={() => onRSVP(user?.userId || "", item.id)}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Yes, I will attend!"}
                </button>
                <button
                  className="px-6 cursor-pointer py-2 bg-red-500 text-white font-medium rounded-full hover:bg-red-700 transition-all"
                  onClick={onClose}
                  disabled={loading}
                >
                  Nevermind
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white px-5 py-5 w-full md:w-3/5 md:rounded relative max-h-full m-auto overflow-y-auto lg:overflow-hidden custom-scrollbar">
            <button
              onClick={onClose}
              className="absolute bg-white px-2 top-3 right-5 text-gray-700 transition-transform duration-300 hover:scale-110 focus:outline-none m-auto"
            >
              <i className="fa-solid fa-x text-lg"></i>
            </button>
            <h1 className="text-sm md:text-3xl tracking-wide font-bold text-center text-gray-800 mb-5">
              RSVP for {item?.name}
            </h1>

            <div className="flex flex-col h-full space-y-4 px-4 md:px-12">
              <div className="flex items-center">
                <h1 className="text-4xl font-bold mr-4">1</h1>
                <p className="text-xs md:text-sm ml-12">
                  Send an e-transfer with{" "}
                  <strong>
                    Your Full Name | Number of Tickets You Are Purchasing in the
                    Transfer Description
                  </strong>{" "}
                  to the following email:{" "}
                  <a
                    href="mailto:unsalalp10@gmail.com"
                    className="text-blue-500 hover:underline"
                  >
                    unsalalp10@gmail.com
                  </a>
                  . ($15 / ticket)
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
                  Await a confirmation email to confirm the successful
                  e-transfer and completion of registration.
                </p>
              </div>
              <div className="flex items-center">
                <h1 className="text-4xl font-bold mr-4">4</h1>
                <p className="text-xs md:text-sm ml-12">
                  You’re all set! Pick up your ticket on November 10 or 11
                  between 10:00 am and 3:00 pm.
                </p>
              </div>

              <div>
                <label
                  className="mt-5"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={handleCheckboxChange}
                  />
                  <span
                    className="ml-5 cursor-pointer"
                    style={{ fontSize: "12px" }}
                  >
                    I confirm that I have completed the e-transfer as outlined
                    above, including providing accurate details. I understand
                    that my registration is not finalized until the transfer is
                    verified and that I am responsible for ensuring the correct
                    amount is sent.
                  </span>
                </label>

                <button
                  className="w-full cursor-pointer mt-3 rounded-xl text-white font-bold bg-gradient-to-r from-violet-500 to-purple-500 border hover:bg-blue-800 hover:text-white text-xs md:text-sm py-2 md:py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                  onClick={() => onRSVP(user?.userId || "", item?.id || "")}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Complete Event Registration"}
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
      {/* Nav arrows */}
      <div className="flex justify-end mb-6 gap-3">
        <button
          onClick={goToPrev}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur-sm text-[#1a1a2e] shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
          aria-label="Previous"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur-sm text-[#1a1a2e] shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
          aria-label="Next"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Cards */}
      <div className="w-full overflow-hidden">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{ transform: `translateX(-${(currentIndex * 100) / itemsToShow}%)` }}
          >
            {events.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: "easeOut" }}
                className="w-full md:w-1/3 flex-shrink-0 px-3"
                onClick={() => openModal(item)}
              >
                <div className="group relative rounded-3xl overflow-hidden cursor-pointer h-[26rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.18)] bg-black transition-all duration-500 border border-black/[0.06]">
                  {/* Full-bleed image */}
                  <Image
                    loading="lazy"
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.05]"
                  />

                  {/* Always-visible gradient + info at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/80 via-[#1a1a2e]/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p
                      className="text-white/55 text-[11px] font-medium uppercase tracking-widest mb-1"
                      style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                    >
                      {item.date}
                    </p>
                    <h3
                      className="text-white text-[18px] font-semibold leading-tight mb-1"
                      style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                    >
                      {item.name}
                    </h3>
                    <p
                      className="text-white/50 text-[13px]"
                      style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                    >
                      {item.location}
                    </p>
                  </div>

                  {/* Hover: blur + centred CTA */}
                  <div className="absolute inset-0 bg-[#1a1a2e]/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex items-center justify-center">
                    <span
                      className="inline-flex items-center gap-2 text-white text-[13px] font-semibold uppercase tracking-widest border-b border-white/40 pb-0.5 group-hover:border-white transition-colors duration-300"
                      style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Event Detail Modal ────────────────────────────────── */}
      {selectedItem && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1a1a2e]/60 backdrop-blur-md"
            onClick={closeModal}
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row"
          >
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left: Image */}
            <div className="relative w-full sm:w-2/5 h-56 sm:h-auto flex-shrink-0">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/60 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#1a1a2e]/10" />
            </div>

            {/* Right: Content */}
            <div
              className="flex flex-col justify-between bg-white p-7 overflow-y-auto custom-scrollbar flex-1"
            >
              <div>
                {selectedItem.isRsvp && (
                  <span
                    className="inline-block mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100"
                    style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                  >
                    ✓ You&apos;re registered
                  </span>
                )}
                <h2
                  className="text-[22px] md:text-[28px] font-semibold tracking-tight text-[#1a1a2e] mb-5"
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  {selectedItem.name}
                </h2>

                <div className="space-y-2.5 mb-5">
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#f4f4f8] flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#4a4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p
                      className="text-[14px] text-black/70"
                      style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                    >
                      {selectedItem.date} at {selectedItem.time}
                    </p>
                  </div>
                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#f4f4f8] flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#4a4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p
                      className="text-[14px] text-black/70"
                      style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                    >
                      {selectedItem.location}
                    </p>
                  </div>
                  {/* Price */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#f4f4f8] flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#4a4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <p
                      className="text-[14px] text-black/70"
                      style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                    >
                      {selectedItem.price}
                    </p>
                  </div>
                </div>

                <p
                  className="text-[14px] leading-[1.75] text-black/55"
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  {selectedItem.description}
                </p>
              </div>

              {/* Action buttons */}
              <div className="mt-6">
                {activeEvents.includes(selectedItem.name) ? (
                  selectedItem.isRsvp ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={outlookUrl(selectedItem)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center text-[13px] font-medium text-white rounded-full py-2.5 px-5 bg-gradient-to-br from-[#1a1a2e] to-[#4a4a6a] hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                        style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                      >
                        Add to Outlook
                      </a>
                      <a
                        href={googleUrl(selectedItem)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center text-[13px] font-medium text-[#1a1a2e] rounded-full py-2.5 px-5 border border-black/15 bg-white hover:bg-black/[0.03] hover:shadow-sm transition-all duration-300"
                        style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                      >
                        Add to Google
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={() => openRSVPModal(selectedItem.name)}
                      className="w-full text-[14px] font-medium text-white rounded-full py-3 px-6 bg-gradient-to-br from-[#1a1a2e] via-[#4a4a6a] to-[#1a1a2e] hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                      style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                    >
                      RSVP Now
                    </button>
                  )
                ) : (
                  <p
                    className="text-center text-[13px] text-black/40 border border-dashed border-black/10 rounded-full py-3"
                    style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                  >
                    Registration opening soon
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* RSVP Modal */}
      {isRSVPModalOpen && selectedItem && (
        <RSVPModal
          onClose={closeRSVPModal}
          onRSVP={(userId: string, eventId: string) =>
            handleRSVP(userId, eventId)
          }
          item={selectedItem}
        />
      )}
    </div>
  );
};
