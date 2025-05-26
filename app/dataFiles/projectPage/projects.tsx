export interface Project {
  title: string;
  category: string;
  status: string;
  year: string;
  description: string;
  peopleCount: string;
  difficulty: string;
  projectImg: string;
  director: {
    name: string;
  };
}

export interface ProjectCardProps {
  title: string;
  description: string;
  director: string;
  peopleCount: string;
  difficulty: string;
  imageUrl: string;
  status: string;
  year: string;
}

export const projects = [
{
    title: "AI Music Composer",
    category: "Artificial Intelligence",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Hard",
    projectImg: "/projects/aimusic2.jpg",
    description: "An AI composing system that uses algorithms to generate unique melodies, harmonies, and rhythms, often tailored to specific genres or emotions.",
    director: {
        name: "Richard Augustine & Henry Wang"
    }
},
{
    title: "AI Health Monitor",
    category: "Artificial Intelligence",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Intermediate",
    projectImg: "/projects/aihealthmonitor2.jpg",
    description: "An AI-powered health monitor using Arduino and AI to collect real-time biometric data through sensors, analyzed with machine learning models.",
    director: {
        name: "Mia Mcdonalds"
    }
},
{
    title: "Fixer",
    category: "Artificial Intelligence",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Intermediate",
    projectImg: "/projects/fixer2.jpg",
    description: "An AI-driven platform that automates house searches and optimizes design using AR to build the future of real estate.",
    director: {
        name: "Ethan Carvalho"
    }
},
{
    title: "AI Medical Imaging Diagnostics",
    category: "Artificial Intelligence",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Intermediate",
    projectImg: "/projects/aimedical2.jpg",
    description: "A medical imaging diagnostics project using AI to quickly and accurately detect anomalies in X-rays, MRIs, and CT scans.",
    director: {
        name: "Nathan Wan"
    }
},
{
    title: "SecureFrame",
    category: "Cybersecurity",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Expert",
    projectImg: "/projects/secureframe2.jpg",
    description: "SecureFrame is a tool that uses AI to allow users to selectively encrypt specific objects in a video, such as faces, cars, or license plates, while leaving the rest of the video untouched. This ensures privacy for sensitive content without requiring full-video encryption, making it both efficient and privacy-focused.",
    director: {
        name: "Rishabh Jain"
    }
},
{
  title: "CryptoCatalyst",
  category: "Cybersecurity",
  status: "Active",
  year: "2024-2025",
  peopleCount: "5",
  difficulty: "Expert",
  projectImg: "/projects/cryptoCatalyst.jpg",
  description: "CryptoCatalyst is a cloud storage platform that secures data with client-side encryption using advanced block ciphers and Elliptic Curve Cryptography. Even in a cloud breach, user data remains confidential. Prioritizing privacy and compliance, CryptoCatalyst offers a simple yet powerful solution for secure cloud storage without sacrificing usability.",
  director: {
      name: "Henrique Leite"
  }
},
{
  title: "LatticeTalk",
  category: "Cybersecurity",
  status: "Active",
  year: "2024-2025",
  peopleCount: "5",
  difficulty: "Intermediate",
  projectImg: "/projects/latticeTalk.jpg",
  description: "LatticeTalk is a messaging app that features highly secure user communication with quantum safe encryption. By leveraging lattice based cryptography LatticeTalk will provide end-to-end encryption for all users.",
  director: {
      name: "Kalpi Patel"
  }
},
  {
    title: "BankFrame",
    category: "Mainframe",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Intermediate",
    projectImg: "/projects/bankframe2.jpg",
    description: "A banking system replica, modelled after CIBC showcasing how the mainframe securely manages financial data.",
    director: {
        name: "Justin Dhillon"
    }
},
{
    title: "RiskGuard",
    category: "Mainframe",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Hard",
    projectImg: "/projects/riskguard2.jpg",
    description: "A fraud detection service leveraging machine learning on the mainframe to identify and prevent credit card fraud.",
    director: {
        name: "Justin Dhillon"
    }
},
{
    title: "E-Commerce Simulation",
    category: "Mainframe",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Intermediate",
    projectImg: "/projects/ecommerce3.jpg",
    description: "An app similar to Amazon where the mainframe ensures fast, secure, and scalable transactions.",
    director: {
        name: "Justin Dhillon"
    }
},



  {
      title: "MicroGuard",
      category: "Cybersecurity",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/microg.jpg",
      description: "A cybersecurity project with tools for password brute-force, WiFi password grabbing, and data encryption. It aims to enhance user security by providing comprehensive solutions for common vulnerabilities.",
      director: {
          name: "Adam Seaton"
      }
  },
  {
      title: "Software Cryptography Implementation",
      category: "Cybersecurity",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/scyptintero.jpg",
      description: "Learn and implement modern cryptographic systems used in industry through runnable software. This project provides hands-on experience with the algorithms and protocols that secure digital communications.",
      director: {
          name: "Hunter Korble"
      }
  },
  {
      title: "Pneumonia Detection Model",
      category: "Artificial Intelligence",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/pnDetect.jpg",
      description: "Create a pneumonia detection model to help medical professionals diagnose scans more efficiently. The model leverages AI to analyze medical images, improving diagnostic accuracy and speed.",
      director: {
          name: "Alp Unsal"
      }
  },
  {
      title: "Web App VIP (Vulnerability Identification Platform)",
      category: "Cybersecurity",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/vipWebApp.jpg",
      description: "A solution for users to analyze web apps for vulnerabilities using OWASP ZAP. This platform empowers developers to identify and address security issues proactively.",
      director: {
          name: "Dileep Dhami"
      }
  },
  {
      title: "NetProbe X",
      category: "Cybersecurity",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/netprobe.jpg",
      description: "Explore network analysis with a GUI using Wireshark and Python for data visualization. This project offers an intuitive interface for monitoring network traffic and identifying anomalies.",
      director: {
          name: "Zaki Hasan Ali"
      }
  },
  {
      title: "Spotify Playlist Generator",
      category: "Artificial Intelligence",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/spotify.jpg",
      description: "Create playlists that transition seamlessly using ML by scraping and analyzing data from the Spotify API. The tool enhances the listening experience by curating personalized music recommendations.",
      director: {
          name: "Ethan Carvalho"
      }
  },
  {
      title: "ASL to English Translator",
      category: "Artificial Intelligence",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/asl.jpg",
      description: "Utilize computer vision to bridge communication between the hearing-impaired and non-ASL speakers. This innovative solution fosters inclusivity and enhances interaction in diverse settings.",
      director: {
          name: "Geoff Easton"
      }
  },
  {
      title: "AWS Cloud Fusion",
      category: "Web3",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/awscf.jpg",
      description: "Merge web hosting and serverless applications on AWS while building a static website and messaging app. This project demonstrates the power of cloud technologies in creating scalable applications.",
      director: {
          name: "Ganesh Krishna Menon"
      }
  },
  {
      title: "Twitter Stock Trading AI",
      category: "Artificial Intelligence",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/TWTRADINGSTOCK.jpg",
      description: "Analyze tweet sentiment using Transformers and correlate with real-time stock prices. This project explores the intersection of social media and financial markets, providing insights for traders.",
      director: {
          name: "Bashshar Atif"
      }
  },
  {
      title: "NeoArtSphere",
      category: "Web3",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/neoart.jpg",
      description: "A platform for artists in underprivileged areas to showcase and sell their art as NFTs. This initiative aims to empower creators by providing them with access to global markets and audiences.",
      director: {
          name: "Bashshar Atif"
      }
  }
];