"use client"
import { useState } from "react";
import { motion, } from "framer-motion";
import RagPage from "./RagPage";

export default function RagIcon() {
    const [open, setOpen] = useState(false);

    const handleOnclick = () => {
        setOpen(prev => !prev);
    }
   
    return (
        <>
        {!open && (
          <motion.div 
          className="fixed bottom-10 right-10 z-50 hover:scale-110 transition-transform duration-300 rounded-full "
            initial={{ opacity: 0, y: 8}}
            animate={{ opacity: 1, y: 0}}
            transition={{ duration: 0.3 }}
            
            >
                {/* Glowing falling tail 
                <motion.div
                    className="absolute left-1/2 top-1/2"
                    style={{
                    width: "12px",
                    height: "120px",
                    background: "linear-gradient(180deg, rgba(57,255,20,0.7) 0%, rgba(31,114,10,0.4) 60%, rgba(0,51,0,0) 100%)",
                    filter: "blur(8px)",
                    transform: "translate(-50%, -10%)",
                    zIndex: -1,
                    borderRadius: "8px",
                    }}
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 30 }}
                    transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    }}
                /> */}
              <button className="w-15 h-15 " 
                onClick={handleOnclick}>
                  <motion.img 
                    src="./omnitrix.png"
                    alt="omnitrix" 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
              </button>
          </motion.div>
        )}
       {open && <RagPage onClose={() => setOpen(false)}/>}
        </>
    )
}