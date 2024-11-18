"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAdmin, getAllUsers, getEventRsvps } from '../lib/actions/user.action';
import { getEventRsvpCounts } from '../lib/actions/event.action';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

interface User {
  firstName: string;
  lastName: string;
  program: string;
  year: string;
  plan: string;
}

interface EventRsvp {
  eventName: string;
  rsvpCount: number;
}
  
interface Rsvp {
  firstName: string;
  lastName: string;
  plan: string;
}

export default function AdminDashboard() {
  const [inputPassword, setInputPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('Data');
  const [users, setUsers] = useState<User[]>([]);
  const [rsvpCounts, setRsvpCounts] = useState<EventRsvp[]>([]);
  const [ibmRsvps, setIbmRsvps] = useState<Rsvp[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsersAndRsvps();
      fetchIBMRsvps();
    }
  }, [isAuthenticated]);

  const fetchUsersAndRsvps = async () => {
    try {
      const rsvpData = await getEventRsvpCounts();
      setRsvpCounts(rsvpData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchIBMRsvps = async () => {
    try {
      const rsvpData = await getEventRsvps('66ec9010adb24a0b510d97eb');
      setIbmRsvps(rsvpData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleLogin = async () => {
    try {
      const isAdmin = await checkAdmin(inputPassword)
      if (isAdmin) {
        setIsAuthenticated(true);
      } else {
        console.log("YOU ARE NOT AN ADMIN :(")
        router.push('/');
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      router.push('/');
    }
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
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
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className="content max-w-6xl mx-auto">
          <div className="tab-control flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'Data' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'} transition duration-200`}
              onClick={() => handleTabClick('Data')}
            >
              Data
            </button>
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'Google Analytics' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'} transition duration-200`}
              onClick={() => handleTabClick('Google Analytics')}
            >
              Google Analytics
            </button>
          </div>

          {activeTab === 'Data' && (
            <div className="data-tab bg-white shadow-md rounded-lg p-6">
    <section className="mb-6">
      <h3 className="text-xl font-semibold mb-2">RSVP Data</h3>
      <p className="mb-4 text-gray-500">Total RSVPs: <span className="font-bold">{ibmRsvps.length}</span></p>
      <table className="w-full table-auto bg-gray-50 rounded-lg shadow-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Plan</th>
          </tr>
        </thead>
        <tbody>
          {ibmRsvps.map((user, index) => (
            <tr key={index} className="bg-white odd:bg-gray-100">
              <td className="px-4 py-2">{user.firstName}</td>
              <td className="px-4 py-2">{user.lastName}</td>
              <td className="px-4 py-2">{user.plan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    <section className="mb-6">
      <h3 className="text-xl font-semibold mb-2">IBM RSVPs</h3>
      <p className="mb-4 text-gray-500">Total RSVPs: <span className="font-bold">{ibmRsvps.length}</span></p>
      <table className="w-full table-auto bg-gray-50 rounded-lg shadow-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Plan</th>
          </tr>
        </thead>
        <tbody>
          {ibmRsvps.map((user, index) => (
            <tr key={index} className="bg-white odd:bg-gray-100">
              <td className="px-4 py-2">{user.firstName}</td>
              <td className="px-4 py-2">{user.lastName}</td>
              <td className="px-4 py-2">{user.plan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

              <section className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Event RSVP Counts</h3>
                <ul className="space-y-2">
                  {rsvpCounts.map((event, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded-md shadow-sm">
                      <span className="font-semibold">{event.eventName}</span>: {event.rsvpCount} RSVP(s)
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-2">Contact</h3>
                <p className="text-gray-500">Contact details or form can go here.</p>
              </section>
            </div>
          )}

          {activeTab === 'Google Analytics' && (
            <div className="analytics-tab bg-white shadow-md rounded-lg p-6">
              {/* Google Analytics Tab Content */}
            </div>
          )}
        </div>
      )}
    </div>
    <Footer />
    </div>
  );
}
