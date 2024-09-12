"use client";
import React, { useCallback, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { loginUser } from '../lib/actions/user.action';
import { useRouter } from "next/navigation";

export default function SignIn() {
    const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ uwoEmail: '', password: '' });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }, []);

  const isFormComplete = useCallback(() => {
    // Ensure all required fields are filled in
    return Object.values(formData).every(value => value !== "");
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete()) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);

    try {
      const token = await loginUser(formData.uwoEmail, formData.password);
      document.cookie = `authToken=${token}; path=/; secure; samesite=strict`; // Setting cookie on the client side
      // Redirect or handle successful login
        router.push('/')
    } catch (error) {
      setError('Email or Password is Incorrect.');
    } finally {
      setLoading(false);
    }
  }, [formData, isFormComplete]);

  return (
    <div>
      <Navbar />
      <div className="flex text-black items-center justify-center min-h-screen bg-gray-100 p-4" style={{ background: '#ededed' }}>
        <div className="bg-white shadow-md rounded-lg p-9 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

          <p className="mb-5 mt-2 text-center">Don't have an account? <a href="/sign-up" className="text-blue-500"><u>Sign Up</u></a></p>

          <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="uwoEmail" className="text-gray-600">Email</label>
                <input
                  type="email"
                  id="uwoEmail"
                  name="uwoEmail"
                  value={formData.uwoEmail}
                  onChange={handleChange}
                  className="border border-gray-400 rounded-md px-1 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

            {/* Password */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="password" className="text-gray-600">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border border-gray-400 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-800 text-white py-2 rounded-md hover:bg-violet-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          {error && <p className="text-center text-red-500 mt-2">{error}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
}