"use client";

import {
  faAtom,
  faCompass,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: <><FontAwesomeIcon icon={faHouse} /> Home</>, href: "/" },
  { name: <><FontAwesomeIcon icon={faCompass}  /> Explorer</>, href: "/explorer" },
  { name: <><FontAwesomeIcon icon={faAtom}  /> Omnitrix Directory</>, href: "/omnitrix" },
];
export default function Header() {
  const pathname = usePathname();

  return (
    <header className="md:flex flex-row items-start justify-start " >
      <div className="">
        <motion.img 
        src="/ben10-logo.png" 
        alt="" 
        className="md:w-24 h-24 object-contain"
         />
      </div>
      {/* Navigation Tabs */}
      <div className="w-full max-w-4xl mx-auto bg-black/70 relative border-b-2 border-l-2 border-r-2 border-[#00FF00]/70 shadow-[0_4px_30px_rgba(0,255,0,0.3)] rounded-lg "> 
      <nav className="flex items-stretch">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex-1 px-6 py-4 font-bold text-center transition-all duration-300 ease-in-out rounded-lg
                ${
                  isActive
                    ? "bg-[#00FF00]/50 text-white border-[#00FF00]/50 shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                    : "bg-transparent text-gray-300 border-[#00FF00]/70 hover:bg-gray-700/70 hover:text-[#00FF00] hover:border-[#00FF00]"
                }
                ${index === 0 ? "rounded-tl-lg" : ""}
                ${index === navItems.length - 1 ? "rounded-tr-lg" : ""}
              `}
            >
              <span className="relative z-10 transition-colors  duration-300 ease-in-out">
                {item.name}
              </span>
              
              {/* Active gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-b from-green-500/20 to-transparent pointer-events-none transition-opacity duration-300 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`} />
              
              {/* Hover glow effect for non-active tabs */}
              {!isActive && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-green-700/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-700/50 blur-sm" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
    </header>
  );
}