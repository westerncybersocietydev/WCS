"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface PayPalButtons {
  render: (container: HTMLElement) => void;
  close: () => void;
}

interface PayPalSDK {
  Buttons: (options: {
    createOrder: () => Promise<string>;
    onApprove: (data: { orderID: string }) => Promise<void>;
    onError: (err: Error) => void;
    onCancel: () => void;
  }) => PayPalButtons;
}

declare global {
  interface Window {
    paypal?: PayPalSDK;
  }
}

export default function IBMTicketPage() {
  const router = useRouter();
  const { user, profileData } = useUser();
  const [loading, setLoading] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventName, setEventName] = useState("IBM Night");
  const [ticketCreated, setTicketCreated] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const paypalButtonContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonsRef = useRef<PayPalButtons | null>(null);

  // Load PayPal JS SDK
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      console.error("PayPal client ID not configured");
      toast.error("Payment system not configured. Please contact support.");
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      `script[src*="paypal.com/sdk/js"]`
    );
    if (existingScript) {
      setPaypalReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=CAD`;
    script.async = true;
    script.onload = () => {
      console.log("PayPal SDK loaded successfully");
      setPaypalReady(true);
    };
    script.onerror = () => {
      console.error("Failed to load PayPal SDK");
      toast.error("Failed to load payment system");
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const scriptToRemove = document.querySelector(
        `script[src*="paypal.com/sdk/js"]`
      );
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  // Fetch event ID from MongoDB
  // Note: Event in MongoDB is stored as "IBM NIGHT" with ID: 66ec9010adb24a0b510d97eb
  useEffect(() => {
    const fetchEventId = async () => {
      if (!user?.userId) return; // Wait for user to be loaded

      try {
        // Try multiple name variations to find the event
        const nameVariations = ["IBM Night", "IBM NIGHT", "ibm night"];
        let found = false;

        for (const name of nameVariations) {
          const response = await fetch(
            `/api/events?name=${encodeURIComponent(name)}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.eventId) {
              setEventId(data.eventId);
              setEventName(data.name || "IBM Night");
              found = true;
              break;
            }
          }
        }

        if (!found) {
          toast.error("Event not found. Please contact support.");
        }
      } catch (error) {
        console.error("Error fetching event ID:", error);
        toast.error("Failed to load event information");
      }
    };

    fetchEventId();
  }, [user?.userId]);

  // Check if user is logged in and redirect VIP members to RSVP form
  useEffect(() => {
    const checkVIPAndRedirect = async () => {
      if (!user?.userId) {
        toast.error("Please log in to purchase a ticket");
        router.push(
          `/sign-in?redirect=${encodeURIComponent("/ibm-night/ticket")}`
        );
        return;
      }

      // If profileData is already loaded, check it
      if (profileData?.plan === "VIP") {
        router.push("/ibm-night/rsvp");
        return;
      }

      // If profileData is null, check VIP status via API
      if (profileData === null && user?.userId) {
        try {
          const response = await fetch("/api/check-vip");
          if (response.ok) {
            const data = await response.json();
            if (data.isVIP) {
              router.push("/ibm-night/rsvp");
              return;
            }
          }
        } catch (error) {
          console.error("Error checking VIP status:", error);
        }
      }
    };

    checkVIPAndRedirect();
  }, [user, profileData, router]);

  // Render PayPal button when ready (only for non-VIP members)
  useEffect(() => {
    // Don't render PayPal for VIP members - they should use RSVP form
    if (profileData?.plan === "VIP") {
      return;
    }

    if (!paypalReady || !window.paypal || !eventId || !user?.userId) {
      return;
    }

    // Clear existing buttons
    if (paypalButtonsRef.current) {
      paypalButtonsRef.current.close();
    }
    if (paypalButtonContainerRef.current) {
      paypalButtonContainerRef.current.innerHTML = "";
    }

    // Create PayPal button
    const buttons = window.paypal.Buttons({
      createOrder: async () => {
        try {
          setLoading(true);
          const response = await fetch("/api/tickets/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventId }),
          });

          const data = await response.json();

          if (data.error) {
            // If user already has a ticket, redirect to confirmation
            if (data.alreadyHasTicket && data.ticketNumber) {
              setTicketCreated(true);
              setTicketNumber(data.ticketNumber);
              toast.error("You already have a ticket for this event");
              router.push(
                `/ibm-night/ticket/confirm?ticketNumber=${data.ticketNumber}&eventId=${eventId}`
              );
              throw new Error("Already has ticket");
            }
            toast.error(data.error);
            throw new Error(data.error);
          }

          // If member, ticket was created for free
          if (data.member) {
            setTicketCreated(true);
            setTicketNumber(data.ticketNumber);
            toast.success("Free ticket created! You're a VIP member.");
            throw new Error("Member — no payment needed.");
          }

          // If not a member, return PayPal order ID
          return data.orderID;
        } catch (error) {
          console.error("Error creating order:", error);
          if (
            error instanceof Error &&
            error.message !== "Member — no payment needed."
          ) {
            toast.error(error.message);
          }
          setLoading(false);
          throw error;
        } finally {
          setLoading(false);
        }
      },
      onApprove: async (data: { orderID: string }) => {
        try {
          setLoading(true);
          const response = await fetch("/api/tickets/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: data.orderID, eventId }),
          });

          const result = await response.json();

          if (result.error) {
            toast.error(result.error);
            return;
          }

          if (result.success) {
            setTicketCreated(true);
            setTicketNumber(result.ticketNumber);
            toast.success("Payment successful! Ticket confirmed.");
            // Redirect to confirmation page
            router.push(
              `/ibm-night/ticket/confirm?ticketNumber=${result.ticketNumber}&eventId=${eventId}`
            );
          }
        } catch (error) {
          console.error("Error capturing payment:", error);
          toast.error("Failed to process payment");
        } finally {
          setLoading(false);
        }
      },
      onError: (err: Error) => {
        console.error("PayPal error:", err);
        toast.error("Payment error occurred");
        setLoading(false);
      },
      onCancel: () => {
        toast.error("Payment cancelled");
        setLoading(false);
      },
    });

    paypalButtonsRef.current = buttons;

    if (paypalButtonContainerRef.current) {
      buttons.render(paypalButtonContainerRef.current);
    }
  }, [paypalReady, eventId, user?.userId, profileData?.plan, router]);

  // Redirect to confirmation if ticket already created
  useEffect(() => {
    if (ticketCreated && ticketNumber && eventId) {
      const timer = setTimeout(() => {
        router.push(
          `/ibm-night/ticket/confirm?ticketNumber=${ticketNumber}&eventId=${eventId}`
        );
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [ticketCreated, ticketNumber, eventId, router]);

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

  // If VIP member, show redirect message (they should be redirected by useEffect)
  if (profileData?.plan === "VIP") {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-lg mb-4">
              VIP members should use the RSVP form.
            </p>
            <p className="text-gray-600">Redirecting...</p>
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
                  Get Your Ticket
                </h1>
                <p className="text-sm md:text-lg md:text-xl leading-relaxed">
                  {profileData?.plan === "VIP"
                    ? "VIP members get free tickets!"
                    : "Non-members: $2 CAD"}
                </p>
              </div>
            </div>
          </section>

          {/* Ticket Purchase Section */}
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
                  {eventName} Ticket
                </h2>

                {profileData && (
                  <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Logged in as:</strong> {profileData.firstName}{" "}
                      {profileData.lastName}
                    </p>
                    <p className="text-gray-700">
                      <strong>Membership:</strong>{" "}
                      <span
                        className={
                          profileData.plan === "VIP"
                            ? "text-green-600 font-semibold"
                            : "text-gray-600"
                        }
                      >
                        {profileData.plan}
                      </span>
                    </p>
                  </div>
                )}

                {ticketCreated && ticketNumber ? (
                  <div className="text-center">
                    <div className="mb-6 p-6 bg-green-50 rounded-lg border-2 border-green-500">
                      <i className="fa-solid fa-check-circle text-green-500 text-5xl mb-4"></i>
                      <h3 className="text-2xl font-bold text-green-800 mb-2">
                        Ticket Created!
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Your ticket number:{" "}
                        <strong className="text-xl">{ticketNumber}</strong>
                      </p>
                      <p className="text-sm text-gray-600">
                        Redirecting to confirmation page...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {profileData?.plan === "VIP" ? (
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-800">
                          <i className="fa-solid fa-info-circle mr-2"></i>
                          As a VIP member, you&apos;ll receive a free ticket.
                          Click the button below to claim it.
                        </p>
                      </div>
                    ) : (
                      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-yellow-800">
                          <i className="fa-solid fa-info-circle mr-2"></i>
                          Non-members: $2 CAD per ticket. VIP members get free
                          tickets.
                        </p>
                      </div>
                    )}

                    {loading && (
                      <div className="text-center mb-6">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <p className="mt-2 text-gray-600">Processing...</p>
                      </div>
                    )}

                    {!paypalReady && !loading && (
                      <div className="text-center mb-6 p-4 bg-gray-100 rounded-lg">
                        <p className="text-gray-600">
                          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                          Loading payment system...
                        </p>
                      </div>
                    )}

                    <div className="mt-6">
                      <div
                        ref={paypalButtonContainerRef}
                        id="paypal-button-container"
                        className="min-h-[50px]"
                      />
                      {!paypalReady && (
                        <p className="text-sm text-gray-500 text-center mt-2">
                          PayPal payment button will appear here
                        </p>
                      )}
                    </div>
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
