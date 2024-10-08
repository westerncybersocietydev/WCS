// app/metadata.ts
type MetadataConfig = {
    [key: string]: { title: string; description: string; url: string };
  };
  
  export const metadataConfig: MetadataConfig = {
    "/": {
      title: "Home - Western Cyber Society",
      description: "Begin your innovation journey with WCS. Join our cyber society classes, engage in exciting tech events, and connect with like-minded individuals.",
      url: "http://westerncybersociety.ca/"
    },
    "/overview": {
      title: "About Us - Western Cyber Society",
      description: "Learn more about the Western Cyber Society and our mission.",
      url: "http://westerncybersociety.ca/meet-the-team"
    },
    "/contact": {
      title: "Contact Us - Western Cyber Society",
      description: "Get in touch with us for inquiries, support, and more information about our programs.",
      url: "http://westerncybersociety.ca/contact"
    },
    "/events": {
      title: "Events - Western Cyber Society",
      description: "Explore upcoming events, workshops, and seminars organized by the Western Cyber Society.",
      url: "http://westerncybersociety.ca/events"
    },
    "/ibm": {
      title: "IBM Collaboration - Western Cyber Society",
      description: "Discover our partnership with IBM and how it enhances our learning and innovation opportunities.",
      url: "http://westerncybersociety.ca/ibm"
    },
    "/meet-the-team": {
      title: "Meet the Team - Western Cyber Society",
      description: "Get to know the passionate individuals behind the Western Cyber Society.",
      url: "http://westerncybersociety.ca/meet-the-team"
    },
    "/myevents": {
      title: "My Events - Western Cyber Society",
      description: "Manage your participation in events, view your registrations, and stay updated.",
      url: "http://westerncybersociety.ca/myevents"
    },
    "/profile": {
      title: "Profile - Western Cyber Society",
      description: "View and edit your profile, track your activities, and manage your settings.",
      url: "http://westerncybersociety.ca/profile"
    },
    "/projects": {
      title: "Projects - Western Cyber Society",
      description: "Showcase your projects, collaborate with others, and explore innovative ideas.",
      url: "http://westerncybersociety.ca/projects"
    },
    "/sign-in": {
      title: "Sign In - Western Cyber Society",
      description: "Access your account to join our community and manage your activities.",
      url: "http://westerncybersociety.ca/sign-in"
    },
    "/sign-up": {
      title: "Sign Up - Western Cyber Society",
      description: "Join the Western Cyber Society and start your journey towards innovation and collaboration.",
      url: "http://westerncybersociety.ca/sign-up"
    },
    "/sponsorships": {
      title: "Sponsorship Opportunities - Western Cyber Society",
      description: "Learn about sponsorship opportunities and how you can support our mission.",
      url: "http://westerncybersociety.ca/sponsorships"
    },
    // Add more routes as needed
  };
  