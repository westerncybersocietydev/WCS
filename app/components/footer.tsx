import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
    <div className="container mx-auto flex justify-center">
      <div className="flex-1">
        <h4 className="font-bold mb-4 text-center md:text-left">Resources</h4>
        <ul className="space-y-1 text-center md:text-left">
          <li><a href="/overview" className="hover:underline">Overview</a></li>
          <li><a href="/projects" className="hover:underline">Projects</a></li>
          <li><a href="/events" className="hover:underline">Events</a></li>
        </ul>
      </div>
      <div className="flex-1">
        <h4 className="font-bold mb-4 text-center md:text-left">Team & Partners</h4>
        <ul className="space-y-1 text-center md:text-left">
          <li><a href="/meetTheTeam" className="hover:underline">Meet the Team</a></li>
          <li><a href="/sponsorships" className="hover:underline">Sponsorships</a></li>
          <li><a href="/ibm" className="hover:underline">IBM</a></li>
        </ul>
      </div>
      <div className="flex-1">
        <h4 className="font-bold mb-4 text-center md:text-left">Connect With Us</h4>
        <ul className="space-y-1 text-center md:text-left">
        <li><a href="/contact" className="hover:underline">Get in Touch</a></li>
          <li><a href="https://www.instagram.com/westerncybersociety/" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a></li>
          <li><a href="https://www.linkedin.com/company/western-cyber-society/mycompany/" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a></li>
        </ul>
      </div>
    </div>
    <p className="px-5 mt-8 text-sm">
      © {new Date().getFullYear()} Western Cyber Society. All Rights Reserved.
    </p>
  </footer>
  )
}
