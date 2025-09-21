"use client";
import React, { useCallback, useState, Suspense } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { loginUser } from "../lib/actions/user.action";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsComponent />
    </Suspense>
  );
}

function SearchParamsComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("event");

  const { fetchUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ uwoEmail: "", password: "" });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    },
    []
  );

  const isFormComplete = useCallback(() => {
    setError("");
    return Object.values(formData).every((value) => value !== "");
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormComplete()) {
        setError("Please fill in all fields.");
        return;
      }

      setLoading(true);

      // Production mode - real authentication required
      const DEV_MODE = false;
      if (DEV_MODE) {
        console.log("🚀 DEV MODE: Bypassing sign-in authentication");
        try {
          // Create a mock JWT token for development
          const mockToken = "dev_mock_token_" + Date.now();
          document.cookie = `authToken=${mockToken}; path=/; secure; samesite=strict`;

          // Simulate successful login
          await fetchUser();
          toast.success("Signed In Successfully (DEV MODE).");
          router.push(redirect || "/");
        } catch (error) {
          toast.error("Error in development mode sign-in.");
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        const token = await loginUser(formData.uwoEmail, formData.password);
        document.cookie = `authToken=${token}; path=/; secure; samesite=strict`; // Setting cookie on the client side
        // Redirect or handle successful login
        await fetchUser();
        toast.success("Signed In Successfully.");
        router.push(redirect || "/");
      } catch (error) {
        toast.error("Email or Password is Incorrect.");
      } finally {
        setLoading(false);
      }
    },
    [formData, isFormComplete, fetchUser, router, redirect]
  );

  return (
    <main>
      <div>
        <Navbar />
        <div className="mt-16 flex flex-col text-black items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-md p-9 w-full max-w-lg shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)] shadow-gray-300">
            <h2 className="text-3xl mb-5 font-bold text-center text-gray-800">
              SIGN IN
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* UWO Email */}
                <div className="flex flex-col">
                  <label
                    htmlFor="uwoEmail"
                    className="text-gray-600 font-bold text-sm"
                  >
                    Email <span className="font-normal">(required)</span>
                  </label>
                  <input
                    type="email"
                    id="uwoEmail"
                    name="uwoEmail"
                    value={formData.uwoEmail}
                    onChange={handleChange}
                    className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                    required
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="text-gray-600 font-bold text-sm"
                  >
                    Password <span className="font-normal">(required)</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full tracking-widest rounded-full font-semibold text-white
                  border-2 font-bold bg-gradient-to-r from-violet-500 to-purple-500 hover:scale-105 hover:bg-gradient-to-r hover:from-violet-800 hover:to-purple-800
                  py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
              <div>
                <p className="mb-1 mt-5 text-center text-sm">
                  Forgot your password?{" "}
                  <a
                    onClick={() =>
                      router.push(
                        `/resetpassword?event=${encodeURIComponent(
                          redirect || ""
                        )}`
                      )
                    }
                    className="text-blue-500 cursor-pointer"
                  >
                    <u>Reset Your Password</u>
                  </a>
                </p>
                <p className="mb-5 mt-1 text-center text-sm">
                  Don&apos;t have an account yet?{" "}
                  <a
                    onClick={() =>
                      router.push(
                        `/sign-up?event=${encodeURIComponent(redirect || "")}`
                      )
                    }
                    className="text-blue-500 cursor-pointer"
                  >
                    <u>Sign Up</u>
                  </a>
                </p>
              </div>
            </form>

            {error && <p className="text-center text-red-500 mt-2">{error}</p>}
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
