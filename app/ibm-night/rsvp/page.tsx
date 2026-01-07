"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import toast from "react-hot-toast";
import Image from "next/image";
import { motion } from "framer-motion";

export default function IBMRsvpPage() {
  const router = useRouter();
  const { user, profileData } = useUser();
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventName, setEventName] = useState("IBM Night");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [hasExistingTicket, setHasExistingTicket] = useState(false);
  const [existingTicketNumber, setExistingTicketNumber] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    uwoEmail: "",
    gmail: "",
    attending: "yes" as "yes" | "no",
  });

  // Fetch event details and pre-fill form
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!user?.userId) {
        toast.error("Please log in to RSVP");
        router.push(`/sign-in?redirect=${encodeURIComponent("/ibm-night/rsvp")}`);
        return;
      }

      try {
        const response = await fetch("/api/events?name=IBM NIGHT");
        if (response.ok) {
          const data = await response.json();
          if (data.eventId) {
            setEventId(data.eventId);
            setEventName(data.name || "IBM Night");
            
            // Fetch full event details
            const eventResponse = await fetch(`/api/events/details?id=${data.eventId}`);
            if (eventResponse.ok) {
              const eventData = await eventResponse.json();
              setEventDate(eventData.date || "");
              setEventTime(eventData.time || "");
              setEventLocation(eventData.location || "");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEventDetails();

    // Pre-fill form with user data
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        uwoEmail: profileData.uwoEmail || "",
        gmail: profileData.preferredEmail || "",
        attending: "yes",
      });
    }
  }, [user, profileData, router]);

  // Check if user already has a ticket for this event
  useEffect(() => {
    const checkExistingTicket = async () => {
      if (!user?.userId || !eventId) return;

      try {
        const response = await fetch(`/api/tickets/details?eventId=${eventId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.ticket) {
            setHasExistingTicket(true);
            setExistingTicketNumber(data.ticket.ticketNumber);
          }
        }
      } catch (error) {
        console.error("Error checking for existing ticket:", error);
      }
    };

    checkExistingTicket();
  }, [user?.userId, eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.uwoEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!eventId) {
      toast.error("Event not found. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/tickets/vip-rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        
        // If user already has a ticket, redirect to confirmation page
        if (data.alreadyHasTicket && data.ticketNumber && eventId) {
          setTimeout(() => {
            router.push(
              `/ibm-night/ticket/confirm?ticketNumber=${data.ticketNumber}&eventId=${eventId}`
            );
          }, 2000);
        }
        return;
      }

      if (data.success) {
        if (data.attending === false) {
          // User is not attending
          toast.success("RSVP received. We're sorry you can't make it!");
          setTimeout(() => {
            router.push("/events");
          }, 2000);
        } else {
          // User is attending - show confirmation
          toast.success("RSVP submitted successfully!");
          router.push(
            `/ibm-night/ticket/confirm?ticketNumber=${data.ticketNumber}&eventId=${eventId}&rsvp=true`
          );
        }
      }
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      toast.error("Failed to submit RSVP. Please try again.");
      setLoading(false);
    }
  };

  if (!user?.userId) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p>Redirecting to login...</p>
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
                  RSVP for {eventName}
                </h1>
                <p className="text-sm md:text-lg md:text-xl leading-relaxed">
                  VIP members get free tickets! Please fill out the form below.
                </p>
              </div>
            </div>
          </section>

          {/* RSVP Form Section */}
          <div className="mx-10 mb-10 mt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px", once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  RSVP Form
                </h2>

                {hasExistingTicket && existingTicketNumber ? (
                  <div className="mb-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-500">
                    <div className="text-center">
                      <i className="fa-solid fa-ticket-alt text-blue-500 text-4xl mb-4"></i>
                      <h3 className="text-xl font-bold text-blue-800 mb-2">
                        You Already Have a Ticket!
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Your ticket number: <strong className="text-lg">{existingTicketNumber}</strong>
                      </p>
                      <button
                        onClick={() =>
                          router.push(
                            `/ibm-night/ticket/confirm?ticketNumber=${existingTicketNumber}&eventId=${eventId}`
                          )
                        }
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        View Ticket Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {profileData?.plan !== "VIP" && (
                      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-yellow-800">
                          <i className="fa-solid fa-exclamation-triangle mr-2"></i>
                          This form is for VIP members only. Basic members should purchase a ticket.
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>

                  {/* UWO Email */}
                  <div>
                    <label
                      htmlFor="uwoEmail"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      UWO Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="uwoEmail"
                      required
                      value={formData.uwoEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, uwoEmail: e.target.value })
                      }
                      placeholder="name@uwo.ca"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>

                  {/* Gmail */}
                  <div>
                    <label
                      htmlFor="gmail"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Gmail / Preferred Email
                    </label>
                    <input
                      type="email"
                      id="gmail"
                      value={formData.gmail}
                      onChange={(e) =>
                        setFormData({ ...formData, gmail: e.target.value })
                      }
                      placeholder="name@gmail.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>

                  {/* Attending */}
                  <div>
                    <label
                      htmlFor="attending"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Will you be attending? <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="attending"
                      required
                      value={formData.attending}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          attending: e.target.value as "yes" | "no",
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option value="yes">Yes, I will be attending</option>
                      <option value="no">No, I cannot attend</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading || !eventId}
                      className="w-full bg-violet-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-violet-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-check mr-2"></i>
                          Submit RSVP
                        </>
                      )}
                    </button>
                  </div>
                </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

