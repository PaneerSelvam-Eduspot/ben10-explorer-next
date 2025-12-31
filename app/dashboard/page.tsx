"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import ExplorerBackground from "../components/ExplorerBackground";
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-[#00FF00]">Loading...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-[#00FF00]">Redirecting...</p>
      </div>
    );
  }

  const { user } = session;

  return (
    <div>
    <ExplorerBackground />
    <div className="min-h-screen bg-transparent  flex items-center justify-center p-6">
      <main className="relative card-wrapper max-w-md w-full p-1"
        style={{ boxShadow: "0 0 20px rgba(0, 255, 0, 0.3)" }}>
          <div></div>
          <div className="card-content w-full max-w-md radial-bg rounded-lg p-8 space-y-6">
          {/*<motion.img  src='./ben10a.png' className="h-40 w-50 mx-auto"/>*/}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#00FF00]">Welcome!</h1>
          <p className="text-white">{user.name || "User"}</p>
        </div>

        <div className="radial-bg rounded-md p-2 border border-[#00FF00]/30">
          <p className="text-sm text-gray-400 mb-1">Email</p>
          <p className="text-white">{user.email}</p>
        </div>
         <div>
          <p className="text-white/70 text-center">You can now explore the world of Ben10!</p>
         </div>
        <div className="space-y-3 pt-2">
           <motion.button 
                    className={` w-full px-6 py-2 mt-4 rounded-md relative border radial-bg hover:scale-101 hover:border-[#00FF00] active:scale-95`}
                    initial={{ "--x": "100%", scale: 1 }}
                    animate={{ "--x": "-100%" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{
                       repeat: Infinity,
                       repeatType: "loop",
                       repeatDelay: 0.5,
                       type: "spring",
                       stiffness: 20,
                       damping: 15,
                       mass: 2,
                       scale :{
                        type: "spring",
                        stiffness: 10,
                        damping: 5,
                        mass: 0.1
                       }
                    }}
                    onClick={() => router.push("/explorer")}
                  >
                   <span className='text-neutral-100 tracking-wide font-light h-full w-full block relative linear-mask'>
                       Explore
                   </span>
                    <span  className='block absolute inset-0 rounded-md p-px linear-overlay'/>
                  </motion.button>
          
           <motion.button 
                    className={` w-full  px-6 py-2 mt-4 border rounded-md relative radial-bg hover:scale-101 hover:border-[#00FF00] active:scale-95`} 
                    initial={{ "--x": "100%", scale: 1 }}
                    animate={{ "--x": "-100%" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{
                       repeat: Infinity,
                       repeatType: "loop",
                       repeatDelay: 0.5,
                       type: "spring",
                       stiffness: 20,
                       damping: 15,
                       mass: 2,
                       scale :{
                        type: "spring",
                        stiffness: 10,
                        damping: 5,
                        mass: 0.1
                       }
                    }}
                    onClick={() => signOut()}
                  >
                   <span className='text-[#00FF00] tracking-wide font-light h-full w-full block relative linear-mask'>
                       Sign Out
                   </span>
                    <span  className='block absolute inset-0 rounded-md p-px linear-overlay'/>
                  </motion.button>
        </div>
        </div>
      </main>
    </div>
    </div>
  );
}