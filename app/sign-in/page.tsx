"use client";
import React, { useCallback, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { loginUser } from '../lib/actions/user.action';
import { useRouter } from "next/navigation";
import { useUser } from '../context/UserContext';

export default function SignIn() {
    const router = useRouter();

    const { fetchUser } = useUser();
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
      await fetchUser();
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
      <div className="flex flex-col text-black items-center min-h-screen bg-gray-100 p-4" style={{ background: '#ededed' }}>
        <div className='w-full'>
          <h2 className="text-3xl font-bold text-center text-gray-800">SIGN IN</h2>
          <p className="mb-5 mt-2 text-center">Don&apos;t have an account? <a href="/sign-up" className="text-blue-500"><u>Sign Up</u></a></p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-9 w-full max-w-lg">
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
                  className="border border-gray-500 rounded shadow-sm pl-3 px-1 py-1 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
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
                className="border border-gray-500 rounded shadow-sm pl-3 px-1 py-1 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="w-full bg-violet-800 text-white py-2 rounded-full hover:bg-violet-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          {error && <p className="text-center text-red-500 mt-2">{error}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
}