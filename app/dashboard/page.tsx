"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import ExplorerBackground from "../components/backgrounds/ExplorerBackground";
import { motion, type Variants } from 'framer-motion';

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
         <div className="loader"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="loader-reverse"></div>
      </div>
    );
  }

  const { user } = session;

  // Parent controls the stagger timing; each child only declares its own
  // "from -> to" shape via `item`, so the sequence is defined once here
  // instead of a separate delay hand-tuned on every element.
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.15,
        staggerChildren: 0.15,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const avatar: Variants = {
    hidden: { opacity: 0, scale: 0.6, rotate: -8 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div>
      <ExplorerBackground />
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
        <motion.main
          className="relative card-wrapper max-w-md w-full p-1"
          style={{ boxShadow: "0 0 20px rgba(0, 255, 0, 0.3)" }}
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          
          <motion.div
            className="card-content w-full max-w-md radial-bg rounded-lg p-8 space-y-6"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={avatar} className="flex justify-center">
              <motion.img
                src="/ben10Welcome.png"
                className="h-40 w-40"
                animate={{ 
                  scale: [1, 1.3, 0.92, 1.05, 1],
                  filter: [
                    "drop-shadow(0 0 0px rgba(0, 255, 0, 0))",
                    "drop-shadow(0 0 30px rgba(0, 255, 0, 0.9))",
                    "drop-shadow(0 0 8px rgba(0, 255, 0, 0.4))",
                    "drop-shadow(0 0 14px rbga(0, 255, 0, 0.5))",
                    "drop-shadow(0 0 0px rgba(0, 255, 0, 0))",
                  ],
                 }}
                transition={{
                  duration: 3,
                  repeat: 0,
                  ease: "easeInOut",
                  delay: 0,
                }}
              />
            </motion.div>

            <motion.div variants={item} className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-[#00FF00]">Welcome!</h1>
              <p className="text-white">{user.name || "User"}</p>
            </motion.div>

            <motion.div variants={item}>
              <p className="text-white/70 text-center">
                You can now explore the world of Ben10!
              </p>
            </motion.div>

            <div className="space-y-3 pt-2">
              <motion.div variants={item}>
                <motion.button
                  className="w-full px-6 py-2 rounded-md relative border radial-bg hover:scale-101 hover:border-[#00FF00] active:scale-95"
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
                    scale: {
                      type: "spring",
                      stiffness: 10,
                      damping: 5,
                      mass: 0.1,
                    },
                  }}
                  onClick={() => router.push("/explorer")}
                >
                  <span className="text-neutral-100 tracking-wide font-light h-full w-full block relative linear-mask">
                    Explore
                  </span>
                  <span className="block absolute inset-0 rounded-md p-px linear-overlay" />
                </motion.button>
              </motion.div>

              <motion.div variants={item}>
                <motion.button
                  className="w-full px-6 py-2 border rounded-md relative radial-bg hover:scale-101 hover:border-[#00FF00] active:scale-95"
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
                    scale: {
                      type: "spring",
                      stiffness: 10,
                      damping: 5,
                      mass: 0.1,
                    },
                  }}
                  onClick={() => signOut()}
                >
                  <span className="text-[#00FF00] tracking-wide font-light h-full w-full block relative linear-mask">
                    Sign Out
                  </span>
                  <span className="block absolute inset-0 rounded-md p-px linear-overlay" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}