import { FaInstagram, FaTiktok, FaLinkedin } from 'react-icons/fa';

export const socials = [
  {
    platform: 'Instagram',
    name: 'westerncybersociety',
    handle: '@westerncybersociety',
    bio: 'Western Cyber Society (WCS)\nScience, Technology & Engineering\nLeading the future generation of AI, Cyber Security, and Web3.',
    profileUrl: 'https://www.instagram.com/westerncybersociety/',
    profileImage: '/wcsSocialLogo.png',
    color: 'bg-gradient-to-br from-pink-500 to-orange-500',
    Icon: FaInstagram
  },
  {
    platform: 'TikTok',
    name: 'westerncybersociety',
    handle: '@westerncybersociety',
    bio: 'Western Cyber Society\nShaping the future by leading advancements in Artificial Intelligence (AI), Cybersecurity, and Web3.',
    profileUrl: 'https://www.tiktok.com/@westerncybersociety',
    profileImage: '/wcsSocialLogo.png',
    color: 'bg-gradient-to-br from-slate-900 to-neutral-700',
    Icon: FaTiktok
  },
  {
    platform: 'LinkedIn',
    name: 'Western Cyber Society',
    handle: '@westerncybersociety',
    bio: 'Empowering the next generation of leaders in Artificial Intelligence (AI), Cyber Security, and Web3. #LaunchTheFuture',
    profileUrl: 'https://www.linkedin.com/company/western-cyber-society?originalSubdomain=ca',
    profileImage: '/wcsSocialLogo.png',
    color: 'bg-gradient-to-br from-sky-900 to-blue-400',
    Icon: FaLinkedin
  },
];
