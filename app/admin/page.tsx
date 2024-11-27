"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAdmin, getAllEventRsvps, getAllUsers } from "../lib/actions/user.action";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

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
  const [allUsers, setAllUsers] = useState<Rsvp[]>([]);
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
    // Filter RSVPs based on selected event
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
      console.log(allEventData)
    } catch (error) {
      console.error("Error fetching data:", error);
    }    
  }

  const fetchEventRsvps = async () => {
    try {
      const allEventData = await getAllEventRsvps();
      setEvents(allEventData);
      console.log(allEventData)
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

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard bg-gray-100 min-h-screen p-8 text-black">
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
              <h3 className="text-xl font-semibold mb-4">Event RSVPs</h3>

              {/* Dropdown for selecting events */}
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

              {/* RSVP Table */}
              <p className="mb-4 text-gray-500">User Count: <span className="font-bold">{filteredRsvps.length}</span></p>
              <table className="w-full table-auto bg-gray-50 rounded-lg shadow-sm">
                <thead className="bg-gray-200">
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
        )}
      </div>
      <Footer />
    </div>
  );
}