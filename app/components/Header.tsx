"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Explorer", href: "/explorer" },
  { name: "Omnitrix Directory", href: "/omnitrix" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-transparent relative z-50">
      {/* Navigation Tabs */}
      <nav className="flex items-stretch">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex-1 px-6 py-4 font-bold text-center transition-all duration-300 ease-in-out border-b-4
                ${
                  isActive
                    ? "bg-green-700 text-white border-green-700 shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                    : "bg-transparent text-gray-300 border-gray-700 hover:bg-gray-700/70 hover:text-green-700 hover:border-green-500"
                }
                ${index === 0 ? "rounded-tl-lg" : ""}
                ${index === navItems.length - 1 ? "rounded-tr-lg" : ""}
              `}
            >
              <span className="relative z-10 transition-colors duration-300 ease-in-out">
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

      {/* Decorative Border Line */}
      <div className="h-1 bg-gradient-to-r from-green-700 via-green-500 to-green-700 shadow-[0_0_10px_rgba(0,255,0,0.5)]" />
    </header>
  );
}