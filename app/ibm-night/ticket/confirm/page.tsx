"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { motion } from "framer-motion";

export default function TicketConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profileData } = useUser();
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [eventName, setEventName] = useState("IBM Night");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [amountPaid, setAmountPaid] = useState<number | null>(null);
  const [googleCalendarLink, setGoogleCalendarLink] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchTicketDetails = useCallback(
    async (userId: string, eventId: string) => {
      try {
        // Fetch ticket details
        const ticketResponse = await fetch(
          `/api/tickets/details?userId=${userId}&eventId=${eventId}`
        );
        if (ticketResponse.ok) {
          const ticketData = await ticketResponse.json();
          if (ticketData.ticket) {
            setAmountPaid(ticketData.ticket.amountPaid);
          }
        }

        // Fetch event details
        const eventResponse = await fetch(`/api/events/details?id=${eventId}`);
        if (eventResponse.ok) {
          const eventData = await eventResponse.json();
          setEventName(eventData.name || "IBM Night");
          setEventDate(eventData.date || "");
          setEventTime(eventData.time || "");
          setEventLocation(eventData.location || "");

          // Generate Google Calendar link
          if (eventData.date && eventData.time && eventData.location) {
            const startDateTime = formatDateTimeForGoogle(
              eventData.date,
              eventData.time
            );
            const startTime = new Date(`${eventData.date} ${eventData.time}`);
            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + 1);
            const endDateTime = formatDateTimeForGoogle(
              endTime.toDateString(),
              endTime.toTimeString().split(" ")[0]
            );

            const calendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
              eventData.name
            )}&dates=${startDateTime}/${endDateTime}&location=${encodeURIComponent(
              eventData.location
            )}&details=${encodeURIComponent(eventData.description)}`;
            setGoogleCalendarLink(calendarLink);
          }
        }
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const ticketNum = searchParams.get("ticketNumber");
    const eventId = searchParams.get("eventId");

    if (!ticketNum) {
      router.push("/ibm-night");
      return;
    }

    setTicketNumber(ticketNum);

    // Fetch ticket details if needed
    if (user?.userId && eventId) {
      fetchTicketDetails(user.userId, eventId);
    } else {
      setLoading(false);
    }
  }, [searchParams, user, router, fetchTicketDetails]);

  // Utility function to format date and time for Google Calendar
  const formatDateTimeForGoogle = (dateStr: string, timeStr: string) => {
    try {
      const [, month, day, year] = dateStr.split(" ");
      const fullDateStr = `${month} ${day}, ${year} ${timeStr}`;
      const date = new Date(fullDateStr);
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading ticket...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main>
        <Navbar />
        <div className="text-black">
          {/* Hero Section */}
          <section
            className="mt-40 md:mt-16 relative w-full h-[55vw] md:h-[30vw] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/IBMN.png')" }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
                <h1 className="text-xl md:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Ticket Confirmed!
                </h1>
                <p className="text-sm md:text-lg md:text-xl leading-relaxed">
                  Your ticket for {eventName} is ready
                </p>
              </div>
            </div>
          </section>

          {/* Confirmation Section */}
          <div className="mx-10 mb-10 mt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px", once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                    <i className="fa-solid fa-check-circle text-green-500 text-6xl"></i>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Ticket Confirmed
                  </h2>
                  <p className="text-gray-600 text-lg">
                    You&apos;re all set for {eventName}!
                  </p>
                </div>

                {/* Ticket Details */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Ticket Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event:</span>
                      <span className="font-semibold">{eventName}</span>
                    </div>
                    {ticketNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ticket Number:</span>
                        <span className="font-mono font-semibold text-lg">
                          {ticketNumber}
                        </span>
                      </div>
                    )}
                    {profileData && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-semibold">
                            {profileData.firstName} {profileData.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-semibold">
                            {profileData.preferredEmail || profileData.uwoEmail}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Membership:</span>
                          <span
                            className={
                              profileData.plan === "VIP"
                                ? "text-green-600 font-semibold"
                                : "font-semibold"
                            }
                          >
                            {profileData.plan}
                          </span>
                        </div>
                      </>
                    )}
                    {amountPaid !== null && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="font-semibold">
                          {amountPaid === 0 ? (
                            <span className="text-green-600">
                              Free (VIP Member)
                            </span>
                          ) : (
                            `$${amountPaid.toFixed(2)} CAD`
                          )}
                        </span>
                      </div>
                    )}
                    {eventDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold">{eventDate}</span>
                      </div>
                    )}
                    {eventTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-semibold">{eventTime}</span>
                      </div>
                    )}
                    {eventLocation && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-semibold">{eventLocation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Google Calendar Link */}
                {googleCalendarLink && (
                  <div className="mb-6 text-center">
                    <a
                      href={googleCalendarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      <i className="fa-brands fa-google"></i>
                      Add to Google Calendar
                    </a>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    <i className="fa-solid fa-info-circle text-blue-500 mr-2"></i>
                    What&apos;s Next?
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      • Save your ticket number:{" "}
                      <strong className="font-mono">{ticketNumber}</strong>
                    </li>
                    <li>• You&apos;ll receive a confirmation email shortly</li>
                    <li>
                      • Bring your ticket number to the event for check-in
                    </li>
                    <li>• Check your email for event details and location</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => router.push("/myevents")}
                    className="flex-1 bg-violet-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors"
                  >
                    View My Events
                  </button>
                  <button
                    onClick={() => router.push("/events")}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Browse More Events
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
