"use client";

import {
  faAtom,
  faCompass,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "Home", icon: faHouse, href: "/" },
  { name: "Explorer", icon: faCompass, href: "/explorer" },
  { name: "Omnitrix Directory", icon: faAtom, href: "/omnitrix" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="relative">
      {/* Header Container */}
      <div className="flex flex-row items-center justify-between">
        {/* Logo */}
        <div className="w-16 h-16 md:w-24 md:h-24 z-20">
        <Link href="/">
          <motion.img
            src="/ben10-logo.png"
            alt="Ben 10 Logo"
            className="w-full h-full object-contain"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex w-full md:max-w-2xl lg:max-w-4xl mx-auto mt-[-37] bg-black/70 relative z-10 border-b-3 border-[#00FF00]/70 shadow-[0_4px_30px_rgba(0,255,0,0.3)] rounded-b-md">
          <nav className="flex items-stretch w-full">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex-1 px-6 py-4 font-bold text-center transition-all duration-300 ease-in-out
                    ${
                      isActive
                        ? "bg-[#00FF00]/50 text-white border-[#00FF00]/50 shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                        : "bg-transparent text-gray-300 border-[#00FF00]/70 hover:bg-gray-700/70 hover:text-[#00FF00] hover:border-[#00FF00]"
                    }
                    ${index === 0 ? "rounded-tl-lg" : ""}
                    ${index === navItems.length - 1 ? "rounded-tr-lg" : ""}
                  `}
                >
                  <span className="relative z-10 transition-colors duration-300 ease-in-out flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={item.icon} />
                    {item.name}
                  </span>

                  {/* Active gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-b from-green-500/20 to-transparent pointer-events-none transition-opacity duration-300 ease-in-out ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />

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

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden z-20 p-2 text-[#00FF00] hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 z-30 md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Menu Panel */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-64 bg-gray-950 border-l-2 border-[#00FF00]/70 shadow-[-4px_0_30px_rgba(0,255,0,0.3)] z-40 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Close button */}
                <div className="flex justify-end p-4">
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 text-[#00FF00] hover:text-white transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-2 px-4 py-6">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`relative px-6 py-4 font-bold text-left transition-all duration-300 rounded-lg
                          ${
                            isActive
                              ? "bg-[#00FF00]/50 text-white shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                              : "bg-transparent text-gray-300 hover:bg-gray-800 hover:text-[#00FF00]"
                          }
                        `}
                      >
                        <span className="flex items-center gap-3">
                          <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                          {item.name}
                        </span>

                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="mobile-active-indicator"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-[#00FF00] rounded-r"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="mt-auto p-4 border-t border-[#00FF00]/20">
                  <p className="text-xs text-gray-500 text-center">
                   &copy; {new Date().getFullYear()} Ben10 Explorer. All rights reserved.
                  </p>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}