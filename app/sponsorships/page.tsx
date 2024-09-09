"use client"
import React from 'react';
import { useRouter } from "next/navigation";
import Footer from '../components/footer';
import Navbar from '../components/navbar';

const oldSponsors = [
  { name: 'Sponsor 1', logo: "defaultPfp.png" },
  { name: 'Sponsor 2', logo: "defaultPfp.png" },
  { name: 'Sponsor 3', logo: "defaultPfp.png" },
];

export default function Sponsorships() {
  const router = useRouter();

  return (
    <div>
      <Navbar />
    
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 to-purple-900">
      <div className="hidden md:block w-1/4 h-screen bg-cover bg-center">
        
      </div>
      <div className="w-full p-4 bg-white">
        
        <div className="container mx-auto px-4 py-8 mt-5 text-black">
          <h1 className="text-3xl font-bold mb-4">Toronto Tech Expo 2024</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
            <p className="mb-4">
              With the rapid evolution of technologies such as generative AI, Cyber Security, and Mainframe and Web3, today's students are positioned to be the pioneering tech leaders of the future. As the next generation, we are at the forefront of creating new technologies to ensure a better tomorrow. Collaborating with leaders from established student organizations across Ontario, Mango Bloom is gathering the next generation's greatest minds to showcase their talent to established industry executives, founders, and recruiters.
            </p>
            <p className="mb-4">
              The Toronto Tech Expo is a single-day event that combines a conference and a student project showcase.
            </p>
            <h3 className="text-xl font-semibold mb-2">TTE Conference</h3>
            <p className="mb-4">
              A curated assembly featuring expert discussions and panels focused on AI, Cyber Security, and Web3 advancements from high-level executives from IBM, EY, Amazon, and more.
            </p>
            <h3 className="text-xl font-semibold mb-2">TTE Project Expo and Competition</h3>
            <p className="mb-4">
              Explore 60+ innovative student projects centred on artificial intelligence, cybersecurity, and web3. The showcase is also an opportunity for teams to win awards presented by leading sponsors and industry partners.
            </p>
            <p className="mb-4">
              <strong>Date:</strong> Tuesday, March 19th, 2024
            </p>
            <p className="mb-4">
              <strong>Time:</strong> 9:00 am - 5:00 pm EST
            </p>
            <p className="mb-4">
              <strong>Location:</strong> IBM Canada Ltd. Laboratory Information Development, 8200 Warden Avenue, Markham, Ontario, Canada L6G 1C7
            </p>
            <p className="mb-4">
              Toronto Tech Expo is the product of Western University students aiming to create an event for forward-thinking students and companies alike. Our objective is to create an atmosphere where talent can be displayed, experience can be shared, networks can be grown, and innovative ideas can be brought to life.
            </p>
            <p className="mb-4">
              Toronto Tech Expo is selecting 200 university students (40+ Projects) from multiple disciplines such as software engineering, computer science, and business.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Become a Founding Partner</h2>
            <p className="mb-4">
              We are thrilled to extend a personal invite to your organization to join us as a founding Partner of the Toronto Tech Expo.
            </p>
            <p className="mb-4">
              We recognize the excellence and impact your organization has brought to the student technology community and are confident your collaboration will bring value to the Toronto Tech Expo.
            </p>
            <p className="mb-4">
              All partners will be reserved spots in our Student Innovation Showcase (spots limited). Additionally, partners will be officially recognized in productions, media, delegate books, and more.
            </p>
            <p className="mb-4">
              By joining as a founding Partner, you are joining a community of student-led tech organizations across the province in our mission to bring opportunities to and establish collaboration with passionate students across Ontario. All founding Partners will be added to the founder's network group chat and receive contacts of all official TTE sponsors, vendors, recruiters, and speakers.
            </p>
            <p className="mb-4">
              To qualify as a founding partner, clubs must commit at least 10 students by March 1st. Clubs and students are welcome to attend as non-founding partners.
            </p>
            <p className="mb-4">
              Club representatives will be sent a student flyer and purchase link to share with their members. Tickets are $50.00/student. (Most clubs have their members pay for themselves individually). The purchase deadline is March 1st.
            </p>
            <p className="mb-4">
              After purchase, students will be sent a registration form to complete for registering themselves and their project if they have one. This registration form must be completed by March 8th.
            </p>
            <p className="mb-4">
              Students arrive from 9:00-9:30 am for check-in on March 19th at the IBM Software Lab!
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Past Sponsors</h2>
            <div className="flex flex-wrap gap-4">
              {oldSponsors.map(sponsor => (
                <div key={sponsor.name} className="w-32 h-32 flex items-center justify-center">
                  <img src={sponsor.logo} alt={`${sponsor.name} Logo`} className="object-contain max-w-full max-h-full" />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              For more information or to get involved, please reach out to us. <a href="/contact" className="text-blue-500 underline">Contact Us</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Support Us</h2>
            <p className="mb-4">
              Your support helps us continue our mission and create more opportunities for students. If you would like to contribute, please consider making a donation.
            </p>
            <a href="https://stripe.com" className="bg-blue-500 text-white px-4 py-2 rounded">Donate Now</a>
          </section>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}
