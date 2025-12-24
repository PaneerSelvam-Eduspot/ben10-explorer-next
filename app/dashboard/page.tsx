"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import ExplorerBackground from "../components/ExplorerBackground";

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
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
      <main className="w-full max-w-md bg-gray-950 rounded-lg border-2 border-[#00FF00] p-8 space-y-6"
        style={{ boxShadow: "0 0 20px rgba(0, 255, 0, 0.3)" }}>
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#00FF00]">Welcome!</h1>
          <p className="text-white">{user.name || "User"}</p>
        </div>

        <div className="bg-black/50 rounded-md p-4 border border-[#00FF00]/30">
          <p className="text-sm text-gray-400 mb-1">Email</p>
          <p className="text-white">{user.email}</p>
        </div>
         <div>
          <p className="text-white/70 text-center">You can now explore the world of Ben10!</p>
         </div>
        <div className="space-y-3 pt-2">
          <Button
            onClick={() => router.push("/explorer")}
            className="w-full bg-[#00FF00] hover:bg-[#00DD00] text-black font-bold py-3 rounded-md transition-all border-2 border-transparent hover:border-white"
          >
            Explorer
          </Button>
          
          <Button
            onClick={() => signOut()}
            className="w-full bg-black hover:bg-gray-900 text-[#00FF00] font-bold py-3 rounded-md border-2 border-[#00FF00] hover:border-white transition-all"
          >
            Sign Out
          </Button>
        </div>
      </main>
    </div>
    </div>
  );
}