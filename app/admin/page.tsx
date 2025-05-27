"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAdmin, getAllEventRsvps, getAllUsers, sendAllEmail } from "../lib/actions/user.action";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import * as XLSX from "xlsx";

interface Rsvp {
  firstName: string;
  lastName: string;
  plan: string;
}

interface EventRsvp {
  eventName: string;
  rsvps: Rsvp[];
}

export default function AdminDashboard() {
  const [inputPassword, setInputPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState<EventRsvp[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("All Events");
  const [filteredRsvps, setFilteredRsvps] = useState<Rsvp[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      fetchEventRsvps();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedEvent === "All Events") {
      fetchAllUsers();
    } else {
      const event = events.find((e) => e.eventName === selectedEvent);
      setFilteredRsvps(event ? event.rsvps : []);
    }
  }, [selectedEvent, events]);

  const fetchAllUsers = async () => {
    try {
      const allEventData = await getAllUsers();
      setFilteredRsvps(allEventData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchEventRsvps = async () => {
    try {
      const allEventData = await getAllEventRsvps();
      setEvents(allEventData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const isAdmin = await checkAdmin(inputPassword);
      if (isAdmin) {
        setIsAuthenticated(true);
      } else {
        console.error("Not an admin");
        router.push("/");
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      router.push("/");
    }
  };

  const handleSend = async () => {
    try {
      await sendAllEmail();
    } catch (error) {
      console.log("Error sending email to all. Please try again later.");
    }
  }

  const exportToExcel = (selectedEvent: string) => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRsvps);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RSVPs");
  
    // Get the current date and time
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
  
    // Format: YYYY-MM-DD-HH-MM
    const dateTime = `${year}-${month}-${day}-${hour}-${minute}`;
  
    // Generate file name with date and time
    const fileName = `${selectedEvent} RSVPs - ${dateTime}.xlsx`;
  
    XLSX.writeFile(workbook, fileName);
  };

  // TODO
  // VIP status changer
  // Add and Edit Events

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard mt-40 md:mt-16 bg-gray-100 min-h-screen p-8 text-black">
        {!isAuthenticated ? (
          <div className="login-container flex justify-center items-center min-h-screen">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>
              <input
                type="password"
                placeholder="Enter password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />
              <button
                onClick={handleLogin}
                className="w-full text-white bg-violet-500 hover:bg-violet-700 py-2 rounded-md transition"
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          <div className="content max-w-6xl mx-auto">
            <div className="data-tab bg-white shadow-md rounded-lg p-6">
              <button
                onClick={handleSend}
                className="hidden w-full mb-10 text-white bg-violet-500 hover:bg-violet-700 py-2 rounded-md transition"
              >
                Send All Email
              </button>
              <h3 className="text-xl font-semibold mb-4">Event RSVPs</h3>

              <div className="my-5 pt-5">
                <label htmlFor="event-select" className="block font-medium mb-2">
                  Select Event:
                </label>
                <select
                  id="event-select"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="All Events">All</option>
                  {events.map((event, index) => (
                    <option key={index} value={event.eventName}>
                      {event.eventName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Export Button */}
              <div className="flex justify-between items-center mt-4 pb-5">
              <p className="text-gray-500">
                User Count: <span className="font-bold">{filteredRsvps.length}</span>
              </p>
                <button
                  onClick={() => exportToExcel(selectedEvent)}
                  className="text-xs text-white bg-violet-500 hover:bg-violet-700 py-2 px-4 rounded-xl transition"
                >
                  Export to Excel
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto rounded-lg">
              <table className="w-full table-auto bg-gray-50 rounded-lg shadow-sm">
                <thead className="bg-gray-200 text-left">
                  <tr>
                    <th className="px-4 py-2">First Name</th>
                    <th className="px-4 py-2">Last Name</th>
                    <th className="px-4 py-2">Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRsvps.map((rsvp, index) => (
                    <tr key={index} className="bg-white odd:bg-gray-100">
                      <td className="px-4 py-2">{rsvp.firstName}</td>
                      <td className="px-4 py-2">{rsvp.lastName}</td>
                      <td className="px-4 py-2">{rsvp.plan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}