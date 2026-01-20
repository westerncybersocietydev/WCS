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

export default function LostLoveTicketPage() {
  const router = useRouter();
  const { user, profileData } = useUser();
  const [loading, setLoading] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventName, setEventName] = useState("Lost Love Bar Night");
  const [ticketCreated, setTicketCreated] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const paypalButtonContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonsRef = useRef<PayPalButtons | null>(null);

  // Load PayPal JS SDK
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const paypalMode = process.env.NEXT_PUBLIC_PAYPAL_MODE || "sandbox";

    if (!clientId) {
      console.error("PayPal client ID not configured");
      toast.error("Payment system not configured. Please contact support.");
      return;
    }

    console.log("Loading PayPal SDK", { 
      mode: paypalMode, 
      hasClientId: !!clientId,
      clientIdLength: clientId?.length 
    });

    // Check if script already exists
    const existingScript = document.querySelector(
      `script[src*="paypal.com/sdk/js"]`
    );
    if (existingScript) {
      console.log("PayPal script already exists, reusing");
      // Check if window.paypal is available
      if (window.paypal) {
        setPaypalReady(true);
      } else {
        // Wait a bit for script to load
        setTimeout(() => {
          if (window.paypal) {
            setPaypalReady(true);
          }
        }, 1000);
      }
      return;
    }

    // Use sandbox endpoint for sandbox mode, production for live mode
    const paypalBaseUrl = paypalMode === "live"
      ? "https://www.paypal.com"
      : "https://www.sandbox.paypal.com";

    const scriptUrl = `${paypalBaseUrl}/sdk/js?client-id=${clientId}&currency=CAD`;
    console.log("Creating PayPal script with URL:", scriptUrl.replace(clientId, "***"));

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.crossOrigin = "anonymous";
    
    script.onload = () => {
      console.log("PayPal SDK script loaded successfully", { mode: paypalMode, baseUrl: paypalBaseUrl });
      
      // Wait a bit for window.paypal to be available
      const checkPayPal = setInterval(() => {
        if (window.paypal) {
          console.log("window.paypal is now available");
          clearInterval(checkPayPal);
          setPaypalReady(true);
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkPayPal);
        if (!window.paypal) {
          console.error("PayPal SDK loaded but window.paypal is undefined after 5 seconds");
          toast.error("Payment system initialization failed. Please refresh the page.");
        }
      }, 5000);
    };
    
    script.onerror = (error) => {
      console.error("Failed to load PayPal SDK script", { 
        error, 
        mode: paypalMode, 
        baseUrl: paypalBaseUrl,
        scriptUrl: scriptUrl.replace(clientId, "***"),
        clientIdPrefix: clientId?.substring(0, 10) + "..."
      });
      
      // Check what the actual error is
      if (script.src.includes("sandbox")) {
        toast.error("Failed to load PayPal SDK. Please check your sandbox client ID and environment variables.");
      } else {
        toast.error("Failed to load PayPal SDK. Please check your PayPal client ID and environment variables.");
      }
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
  useEffect(() => {
    const fetchEventId = async () => {
      if (!user?.userId) return; // Wait for user to be loaded

      try {
        // Try multiple name variations to find the event
        const nameVariations = ["LOST LOVE BAR NIGHT", "Lost Love Bar Night", "lost love bar night"];
        let found = false;

        for (const name of nameVariations) {
          const response = await fetch(
            `/api/events?name=${encodeURIComponent(name)}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.eventId) {
              setEventId(data.eventId);
              setEventName(data.name || "Lost Love Bar Night");
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

  // Check if user is logged in
  useEffect(() => {
    if (!user?.userId) {
      toast.error("Please log in to purchase a wristband");
      router.push(
        `/sign-in?redirect=${encodeURIComponent("/lost-love-bar-night/ticket")}`
      );
      return;
    }
  }, [user, router]);

  // Render PayPal button when ready
  useEffect(() => {
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

          if (!response.ok || data.error) {
            console.error("Create order error:", { status: response.status, data });
          }

          if (data.error) {
            // If user already has a ticket, redirect to confirmation
            if (data.alreadyHasTicket && data.ticketNumber) {
              setTicketCreated(true);
              setTicketNumber(data.ticketNumber);
              toast.error("You already have a wristband for this event");
              router.push(
                `/lost-love-bar-night/ticket/confirm?ticketNumber=${data.ticketNumber}&eventId=${eventId}`
              );
              throw new Error("Already has ticket");
            }
            toast.error(data.error);
            throw new Error(data.error);
          }

          // If member, ticket was created for free (should not happen for Lost Love, but handle it)
          if (data.member) {
            setTicketCreated(true);
            setTicketNumber(data.ticketNumber);
            toast.success("Wristband created!");
            throw new Error("Member — no payment needed.");
          }

          // Return PayPal order ID
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
            toast.success("Payment successful! Wristband confirmed.");
            // Redirect to confirmation page
            router.push(
              `/lost-love-bar-night/ticket/confirm?ticketNumber=${result.ticketNumber}&eventId=${eventId}`
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
  }, [paypalReady, eventId, user?.userId, router]);

  // Redirect to confirmation if ticket already created
  useEffect(() => {
    if (ticketCreated && ticketNumber && eventId) {
      const timer = setTimeout(() => {
        router.push(
          `/lost-love-bar-night/ticket/confirm?ticketNumber=${ticketNumber}&eventId=${eventId}`
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

  const ticketPrice = profileData?.plan === "VIP" ? "$5.00" : "$8.00";

  return (
    <>
      <main>
        <Navbar />
        <div className="text-black">
          {/* Hero Section */}
          <section
            className="mt-40 md:mt-16 relative w-full h-[55vw] md:h-[30vw] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/projectBg.jpg')" }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
                <h1 className="text-xl md:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Get Your Wristband
                </h1>
                <p className="text-sm md:text-lg md:text-xl leading-relaxed">
                  {profileData?.plan === "VIP"
                    ? "VIP Members — $5.00 CAD"
                    : "Non-Members — $8.00 CAD"}
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
                  {eventName} Wristband
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
                    <p className="text-gray-700 mt-2">
                      <strong>Wristband Price:</strong>{" "}
                      <span className="font-semibold text-violet-600">
                        {ticketPrice} CAD
                      </span>
                    </p>
                  </div>
                )}

                {ticketCreated && ticketNumber ? (
                  <div className="text-center">
                    <div className="mb-6 p-6 bg-green-50 rounded-lg border-2 border-green-500">
                      <i className="fa-solid fa-check-circle text-green-500 text-5xl mb-4"></i>
                      <h3 className="text-2xl font-bold text-green-800 mb-2">
                        Wristband Created!
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Your wristband number:{" "}
                        <strong className="text-xl">{ticketNumber}</strong>
                      </p>
                      <p className="text-sm text-gray-600">
                        Redirecting to confirmation page...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-yellow-800">
                        <i className="fa-solid fa-info-circle mr-2"></i>
                        {profileData?.plan === "VIP" 
                          ? `VIP Members: ${ticketPrice} CAD. Non-Members: $8.00 CAD. Skip the line - straight inside!`
                          : `Non-Members: ${ticketPrice} CAD. VIP Members: $5.00 CAD. Skip the line - straight inside!`}
                      </p>
                    </div>

                    {/* VIP Members use integrated PayPal */}
                    {profileData?.plan === "VIP" && (
                      <>
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

                    {/* Basic/Non-Members use external PayPal link */}
                    {profileData?.plan !== "VIP" && (
                      <div className="mt-6 text-center">
                        <a
                          href="https://www.paypal.com/ncp/payment/LBJNKBUM3MWFA"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block w-full max-w-md bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                        >
                          <i className="fa-brands fa-paypal mr-2"></i>
                          Pay with PayPal - $8.00 CAD
                        </a>
                        <p className="mt-3 text-sm text-gray-600">
                          You will be redirected to PayPal to complete your payment
                        </p>
                      </div>
                    )}
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
