"use client";
import React, { useCallback, useState, Suspense } from "react";
import Navbar from "../components/LandingNavbar";
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
    <main className="relative min-h-screen bg-[#fafafa]">
      <Navbar />
      


      <div className="relative z-10 pt-28 pb-12 flex flex-col text-black items-center justify-center min-h-screen p-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 w-full max-w-lg border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

          <h2 className="text-3xl md:text-4xl mb-10 font-semibold text-center text-black/80 tracking-tight" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
            Welcome Back
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* UWO Email */}
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="uwoEmail"
                  className="text-black/60 font-medium text-xs uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  Email <span className="font-normal lowercase tracking-normal text-black/40">(required)</span>
                </label>
                <input
                  type="email"
                  id="uwoEmail"
                  name="uwoEmail"
                  value={formData.uwoEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
                  placeholder="you@uwo.ca"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-black/60 font-medium text-xs uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  Password <span className="font-normal lowercase tracking-normal text-black/40">(required)</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full py-3.5 rounded-full font-medium text-white text-[15px] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-md"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="mt-8 space-y-3">
              <p className="text-center text-sm text-black/60" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                Forgot your password?{" "}
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/resetpassword?event=${encodeURIComponent(
                        redirect || ""
                      )}`
                    )
                  }
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Reset it
                </button>
              </p>
              <p className="text-center text-sm text-black/60" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                Don&apos;t have an account yet?{" "}
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/sign-up?event=${encodeURIComponent(redirect || "")}`
                    )
                  }
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>

          {error && <p className="text-center text-red-500 text-sm mt-4 font-medium">{error}</p>}
        </div>
      </div>
      <Footer />
    </main>
  );
}
