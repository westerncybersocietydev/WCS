import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <div>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center mt-5">
        {/* Logo */}
        <div className='relative inline-block flex items-center mb-4 md:mb-0 transition-transform duration-300 hover:scale-110 group'>
          <Link href="/" className="flex items-center">
            <Image
              src="/wcsLogo.png"
              layout="fixed"
              width={100}
              height={50}
              alt="Website Logo"
              className="transition-transform duration-300 hover:scale-110"
            />
            <span className="ml-2 mt-1 text-black text-xl justify- opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: 'Logirent' }}>| western cyber society</span>
          </Link>
        </div>

        {/* Other Buttons */}
        <div className="space-x-6 relative flex items-center">
          <div className="relative inline-block group hover:text-xl transition-all duration-200">
            <button className="relative text-gray-600 hover:text-blue-600 focus:outline-none before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-blue-600 before:transition-all before:duration-500 hover:before:w-full">
              ABOUT US
            </button>
            <div className="absolute left-0 w-48 bg-zinc-200 shadow-lg z-20 hidden group-hover:block">
              <Link href="/overview">
                <h2 className="block text-lg px-4 py-2 text-gray-700 hover:bg-blue-100">Overview</h2>
              </Link>
              <Link href="/projects">
                <h2 className="block text-lg px-4 py-2 text-gray-700 hover:bg-blue-100">SIP Projects</h2>
              </Link>
              <Link href="/events">
                <h2 className="block text-lg px-4 py-2 text-gray-700 hover:bg-blue-100">Events</h2>
              </Link>
              <Link href="/meetTheTeam">
                <h2 className="block text-lg px-4 py-2 text-gray-700 hover:bg-blue-100">Meet the Team</h2>
              </Link>
            </div>
          </div>
          <a href="/sponsorships" className="relative text-gray-600 hover:text-blue-600 hover:text-xl transition-all duration-200 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-blue-600 before:transition-all before:duration-500 hover:before:w-full">
            SPONSORSHIPS
          </a>
          <a href="/ibm" className="relative text-gray-600 hover:text-blue-600 hover:text-xl transition-all duration-200 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-blue-600 before:transition-all before:duration-500 hover:before:w-full">
            IBM
          </a>
        </div>
      </div>
    </div>
  );
}
