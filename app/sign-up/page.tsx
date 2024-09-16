"use client";
import React, { useCallback, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { createUser, loginUser } from '../lib/actions/user.action';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import CheckoutForm from '../components/checkoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { useUser } from '../context/UserContext';
import { useRouter } from "next/navigation";

type PlanType = 'Basic' | 'VIP';

const planPerks: Record<PlanType, string[]> = {
  Basic: [
    'Access to basic features',
    'Community support',
    'Limited storage',
  ],
  VIP: [
    'Access to basic features',
    'Community support',
    'Limited storage',
    'Priority support',
    'Unlimited storage',
    'Access to exclusive content',
  ],
};

export default function Signup() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | "">("Basic");
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const { fetchUser } = useUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    uwoEmail: '',
    currentYear: '',
    program: '',
    preferredEmail: '',
    password: '',
    confirmPassword: '', // New field
  });

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
  const options:StripeElementsOptions = {
    mode: 'payment',
    amount: 15 * 100,
    currency: 'cad',
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }, []);  

  const isFormComplete = useCallback(() => {
    // Ensure all fields except preferredEmail are filled in
    return Object.entries(formData).every(([key, value]) => 
      key === 'preferredEmail' || value !== ""
    );
  }, [formData]);  
  
  const handleNext = useCallback(async () => {
    setError('');
    if (!isFormComplete()) {
      setError('Please fill in all required fields.');
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    setLoading(true); // Start loading
  
    if (step === 1) {
      try {
        const response = await fetch('/api/checkEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uwoEmail: formData.uwoEmail }),
        });
        const result = await response.json();
        if (result) {
          setError('UWO email is taken. Please use a different uwo email or login.');
          setLoading(false);
          return;
        }
      } catch (error) {
        setError('Error checking email.');
        setLoading(false);
        return;
      }
    }
  
    setStep(prevStep => prevStep + 1);
    setLoading(false); // Stop loading
  }, [step, formData.uwoEmail, isFormComplete]);  

  const handlePlanSelection = useCallback((plan: PlanType) => {
    setSelectedPlan(plan);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isFormComplete()) {
      setError('Please fill in all required fields.');
      return;
    }
  
    setLoading(true); // Start loading

    try {
      await createUser(
        formData.firstName,
        formData.lastName,
        formData.uwoEmail,
        formData.preferredEmail,
        formData.currentYear,
        formData.program,
        selectedPlan,
        formData.password
      );

      const token = await loginUser(formData.uwoEmail, formData.password);
      document.cookie = `authToken=${token}; path=/; secure; samesite=strict`; // Setting cookie on the client side

      await fetchUser();

      const emailDetails = {
        from: formData.uwoEmail,
        to: formData.preferredEmail.trim() === '' ? formData.uwoEmail : formData.preferredEmail,
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

      const emailResponse = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailDetails }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send welcome email.');
      }

      const result = await emailResponse.json();
      console.log(result.message)


      setStep(3); // Success step
    } catch (error) {
      setError('Error creating account or sending email.');
    } finally {
      setLoading(false);
    }
  }, [formData, selectedPlan]);

  const handleBack = useCallback(() => {
    setError(''); // Clear any existing errors
    if (step > 1) {
      setStep(prevStep => prevStep - 1); // Go back to the previous step
    }
  }, [step]);
  
  return (
    <div>
      <Navbar />
      <div className="flex flex-col text-black items-center justify-center min-h-screen bg-gray-100 p-4" style={{ background: '#ededed' }}>
      <div className='w-full'>
      <h2 className="text-3xl font-bold text-center text-gray-800">
        {step === 1
          ? "SIGN UP"
          : step === 2
          ? "Choose Your Plan"
          : ""}
      </h2>

          { (step === 1 || step === 2) &&
            <p className="mb-5 mt-1 text-center">Already have an account? <a href="/sign-in" className="text-blue-500"><u>Login</u></a></p>
          }

          { step === 2 && (
            <button
              className='mb-4 ml-80 cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-125'
              onClick={() => handleBack()}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
          ) }
      </div>

        <div className="bg-white rounded shadow-md p-9 w-full max-w-lg">
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-4">
                {/* First Name */}
                <div className="flex flex-col space-y-1 w-1/2">
                  <label htmlFor="firstName" className="text-gray-600">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="border border-gray-500 rounded shadow-sm pl-3 px-1 py-1 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                    required
                  />

                </div>

                {/* Last Name */}
                <div className="flex flex-col space-y-1 w-1/2">
                  <label htmlFor="lastName" className="text-gray-600">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="border border-gray-500 rounded shadow-sm pl-3 px-1 py-1 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                    required
                  />
                </div>
              </div>

              {/* UWO Email */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="uwoEmail" className="text-gray-600">UWO Email</label>
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

              {/* Preferred Email */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="preferredEmail" className="text-gray-600">Preferred Email (optional)</label>
                <input
                  type="email"
                  id="preferredEmail"
                  name="preferredEmail"
                  value={formData.preferredEmail}
                  onChange={handleChange}
                  className="border border-gray-500 rounded shadow-sm pl-3 px-1 py-1 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                />
              </div>

              {/* Current Year */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="currentYear" className="text-gray-600 font-medium">Current Year</label>
                <select
                  id="currentYear"
                  name="currentYear"
                  value={formData.currentYear}
                  onChange={handleChange}
                  className="border border-gray-500 rounded-md pl-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:shadow-md hover:border-blue-400 hover:bg-white text-gray-700"
                  required
                >
                  <option value="" disabled>Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year or higher</option>
                </select>
              </div>

              {/* Program */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="program" className="text-gray-600">Program</label>
                <input
                  type="text"
                  id="program"
                  name="program"
                  value={formData.program}
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

              {/* Confirm Password */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="confirmPassword" className="text-gray-600">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border border-gray-500 rounded shadow-sm pl-3 px-1 py-1 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="w-full bg-violet-800 text-white py-2 rounded-full hover:bg-violet-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Select Your Plan</h3>
              <div className="flex space-x-4">
                <div
                  className={`border p-4 flex-1 cursor-pointer transition-colors ${selectedPlan === 'Basic' ? 'bg-gradient-to-br from-slate-200 to-purple-300' : 'hover:bg-gradient-to-br from-slate-100 to-purple-200'}`}
                  onClick={() => handlePlanSelection('Basic')}
                >
                  <h4 className="text-md font-semibold flex justify-between items-center">
                    <span>Basic Plan</span>
                    <span className="text-green-500">Free</span>
                  </h4>
                  <p className="text-sm mt-1 text-gray-600">For students looking to get started.</p>
                </div>
                <div
                  className={`p-4 flex-1 cursor-pointer transition-colors cycling-border ${selectedPlan === 'VIP' ? 'bg-gradient-to-br from-slate-200 to-purple-300' : 'hover:bg-gradient-to-br from-slate-100 to-purple-200'}`}
                  onClick={() => handlePlanSelection('VIP')}
                >
                  <h4 className="text-md font-semibold flex justify-between items-center">
                    <span>VIP Plan</span>
                    <span className="text-blue-500">$15</span>
                  </h4>
                  <p className="text-sm mt-1 text-gray-600">For students who want all the features.</p>
                </div>
              </div>

              <div className={`p-4 bg-white rounded-lg ${selectedPlan === 'VIP' ? 'cycling-border' : 'border'}`}>
                <p className="text-2xl text-center font-bold text-gray-800">{selectedPlan}</p>
                <ul className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  {selectedPlan && planPerks[selectedPlan]?.map((perk, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span><i className="fa-solid fa-check mr-2"></i>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>


              {selectedPlan === 'Basic' ? (
                <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-violet-800 text-white py-2 rounded-full hover:bg-violet-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              ) : (
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm planPrice={15} onPaymentSuccess={handleSubmit} />
                </Elements>
              )}

            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-semibold text-gray-800">Congratulations!</h3>
              <h3 className="text-xl font-semibold text-gray-800">You Are Now a VIP</h3>
              <p className="text-gray-600 mt-2">
                Thank you for signing up for the Western Cyber Society. Check your inbox for an email shortly.
              </p>
              <div className="mt-10">
                <button
                  className='w-full mt-5 bg-violet-800 text-white py-2 rounded-full hover:bg-violet-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                  type='button'
                  onClick={() => router.push('/')}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-center text-red-500 mt-2">{error}</p>}

        </div>
      </div>
      <Footer />
    </div>
  );
}
