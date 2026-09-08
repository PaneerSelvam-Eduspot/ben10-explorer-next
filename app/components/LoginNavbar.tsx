'use client';

import { useSession } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginNavbar() {

  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;


  const handleLoginClick = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else if (!isLoggedIn) {
      router.push('/login');
    } else {
      router.push('/');
    }
  };
  
  return (
    <div className="fixed left-0 top-[28%] z-50 flex flex-col">
      {/* Login Button */}
      <motion.button
        className="md:w-20 md:h-20 p-1 bg-[#00FF00]/70 hover:bg-[#00FF00]/90 flex flex-col items-center justify-center 
                   text-white font-bold shadow-lg transition-all duration-300 group relative
                   rounded-r-2xl"
        whileHover={{ width: '90px', x: 5 }}
        initial={{ width: '55px' }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 0, 0.3)',
        }}
        onClick={handleLoginClick}
      >
        {/* User Icon */}
        <div 
        className="md:w-10 md:h-10 h:8 w-8 p-1 rounded-full bg-black flex items-center justify-center mb-1"
        >
         {!isLoggedIn ? <User className="w-6 h-6 text-green-600" />: session.user?.name?.charAt(0).toUpperCase()}
        </div>
        
        {/* Text */}
        <span className={"text-xs tracking-wide text-white"}>
          {isLoggedIn ? 'Log Out' : 'Log In'}
          </span>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-r-2xl bg-green-400/0 group-hover:bg-green-400/20 transition-all duration-300" />
      </motion.button>
    </div>
  );
}