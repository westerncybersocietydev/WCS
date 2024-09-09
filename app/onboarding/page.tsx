"use client";
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function Onboarding() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    uwoEmail: '',
    currentYear: '',
    program: '',
    preferredEmail: '',
    plan: '' // Added plan to formData
  });
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const isFormComplete = () => {
    // Check if all required fields are filled
    return (
      formData.firstName &&
      formData.lastName &&
      formData.uwoEmail &&
      formData.currentYear &&
      formData.program
    );
  };

  const handleNext = () => {
    console.log()
    if (isFormComplete()) {
      setStep(step + 1);
      setProgress(50); // Progress to 50% when "Next" is clicked
    } else {
      setError('Please fill in all required fields.');
    }
  };
  const handlePlanSelection = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailDetails = {
      from: formData.uwoEmail,
      to: formData.uwoEmail,
      subject: 'Welcome to Western Cyber Society',
      message: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Western Cyber Society</title>
            <style>
                body {
                    font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    background-color: #f5f5f7;
                    color: #1d1d1f;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding-bottom: 30px;
                }
                .header h1 {
                    color: #1d1d1f;
                    font-size: 32px;
                    font-weight: 600;
                    margin-bottom: 0;
                }
                .header p {
                    font-size: 18px;
                    color: #6e6e73;
                    margin-top: 10px;
                    margin-bottom: 0;
                }
                .content {
                    padding: 20px 0;
                    line-height: 1.7;
                    font-size: 18px;
                }
                .content p {
                    margin-bottom: 20px;
                }
                .highlight {
                    color: #0071e3;
                    font-weight: 600;
                }
                .cta {
                    text-align: center;
                    margin-top: 40px;
                }
                .cta a {
                    display: inline-block;
                    background-color: #0071e3;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 14px 28px;
                    border-radius: 28px;
                    font-weight: 600;
                    font-size: 18px;
                }
                .cta a:hover {
                    background-color: #005bb5;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    font-size: 12px;
                    color: #86868b;
                    border-top: 1px solid #e0e0e2;
                    padding-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Welcome to Western Cyber Society</h1>
                    <p>Your Journey into Innovation Begins Here</p>
                </div>
                <div class="content">
                    <p>Hi <span class="highlight">${formData.firstName}</span>,</p>
                    <p>Welcome to the <span class="highlight">Western Cyber Society</span>! You are now part of an exclusive community that is dedicated to pushing the boundaries of technology and innovation.</p>
                    <p>Prepare to explore new horizons, collaborate with like-minded peers, and gain access to resources that will help you shape the future of tech.</p>
                    <p>We're excited to have you on board. Let's make the future together.</p>
                </div>
                <div class="cta">
                    <a href="#">Explore Your Dashboard</a>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Western Cyber Society. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };
    
    setLoading(true);
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailDetails }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      setStep(step + 1);
      setProgress(100); // Progress to 50% when "Next" is clicked

      console.log(result.message);
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setLoading(false);
    }
    console.log('Form submitted:', formData);
  };

  return (
    <div>
      <Navbar />
      <div className="flex text-black items-center justify-center min-h-screen bg-gray-100 p-4" style={{ background: '#ededed' }}>
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {step === 1
              ? "Onboarding Form"
              : step === 2
              ? "Choose Your Plan"
              : "Success"}
          </h2>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          { step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="firstName" className="text-gray-600">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="lastName" className="text-gray-600">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="uwoEmail" className="text-gray-600">UWO Email</label>
              <input
                type="email"
                id="uwoEmail"
                name="uwoEmail"
                value={formData.uwoEmail}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="currentYear" className="text-gray-600">Current Year</label>
              <select
                id="currentYear"
                name="currentYear"
                value={formData.currentYear}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year or higher</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="program" className="text-gray-600">Program</label>
              <input
                type="text"
                id="program"
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="preferredEmail" className="text-gray-600">Preferred Email (optional)</label>
              <input
                type="email"
                id="preferredEmail"
                name="preferredEmail"
                value={formData.preferredEmail}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              onClick={handleNext}
              disabled={loading}
              className="w-full bg-violet-800 text-white py-2 rounded-md hover:bg-violet-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? 'Saving...' : 'Next'}
            </button>
          </form>)}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Select Your Plan</h3>
              <div className="flex space-x-4">
              <div
                  className={`border p-4 rounded-md flex-1 cursor-pointer transition-colors ${selectedPlan === 'Basic' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  onClick={() => handlePlanSelection('Basic')}
                >
                  <h4 className="text-lg font-semibold flex justify-between items-center">
                    <span>Basic Plan</span>
                    <span className="text-green-500">Free</span>
                  </h4>
                  <p className="text-gray-600">For students looking to get started.</p>
                  <ul className="mt-2 text-xs list-disc list-inside text-gray-700">
                    <li>Access to core features</li>
                    <li>Basic support</li>
                    <li>Monthly newsletter</li>
                  </ul>
                </div>
              <div
                  className={`border p-4 rounded-md flex-1 cursor-pointer transition-colors ${selectedPlan === 'VIP' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  onClick={() => handlePlanSelection('VIP')}
                >
                  <h4 className="text-lg font-semibold flex justify-between items-center">
                    <span>VIP Plan</span>
                    <span className="text-blue-500">$5</span>
                  </h4>
                  <p className="text-gray-600">For students who want all the features.</p>
                  <ul className="mt-2 text-xs list-disc list-inside text-gray-700">
                    <li>Access to core features</li>
                    <li>Priority support</li>
                    <li>Weekly newsletter</li>
                    <li>Exclusive content</li>
                    <li>Early access to new features</li>
                    <li>VIP community forum</li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          )}


          {step === 3 && (
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800">Thank You!</h3>
              <p className="text-gray-600">Your submission has been received.</p>
              <a className='text-sm text-blue-500 underline' href='/'>Go back to Home Page</a>
            </div>
          )}

          {loading && <p className="text-center text-blue-500">Sending email...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

        </div>
      </div>
      <Footer />
    </div>
  );
}
