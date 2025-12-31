"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, 
  Clock,
  MinusIcon,
  SquarePenIcon,
  ArrowUp,
  Lock,

} from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

const LoadingBubble = () => {
  return (
    <div className="flex gap-3 items-start">
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-green-500" />
        <span className="text-sm text-gray-400">Thinking...</span>
      </div>
    </div>
  );
};

const Bubble = ({ message }: { message: Message }) => {
  const { content, role, timestamp } = message;
  const isUser = role === "user";
  const { data: session } = useSession();

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <motion.div className="h-7 w-7 bg-[#006A4E] shrink-0 rounded-full">
          <motion.img 
            src="./ben10.png"
            alt="ben10img" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}
      <div className={`max-w-[85%] md:max-w-[70%]`}>
        <div
          className={`rounded-lg p-3 ${
            isUser
              ? "bg-black/70 text-white"
              : "bg-gray-800/50 text-gray-100 border border-gray-700/50"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-gray-500 mt-1 block">{timestamp}</span>
        )}
      </div>
      {isUser && (
        <div className="h-7 w-7 shrink-0 rounded-full bg-[#006A4E]">

          <motion.div 
          className="h-5 w-5 mx-auto mt-1 opacity-70 text-white font-bold text-center" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          >
            {session.user?.name?.charAt(0).toUpperCase()}
          </motion.div>
        </div>
      )}
    </div>
  );
};

const LoginPrompt = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col radial-bg-dark items-center justify-center h-full space-y-6 p-8">
      <div className="bg-green-600/10 rounded-full p-6 border border-green-500">
        <Lock className="h-12 w-12 text-green-500" />
      </div>
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-white">
          Authentication Required
        </h2>
        <p className="text-sm text-gray-400 max-w-md">
          Please log in to access assist10 and get personalized help about Ben 10 aliens!
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={() => router.push('/login')}
          className="bg-green-600 hover:bg-green-500 text-white"
        >
          Log In
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default function RagPage({ onClose }: { onClose?: () => void }) {
  const { data: session, isPending } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!session?.user;
  const userId = session?.user?.id;

  // Load chat history for this user when logged in
  useEffect(() => {
    if (!isLoggedIn || !userId) {
      setMessages([]);
      return;
    }

    const loadChatHistory = async () => {
      try {
        const response = await fetch('/api/chat/history');
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };

    loadChatHistory();
  }, [isLoggedIn, userId]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    if (!isLoggedIn) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = { role: "user" as const, content: text, timestamp };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          history: messages,
          userId: userId, // Send userId to track user-specific conversations
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const data = await res.json();

      const assistantMessage = { 
        role: "assistant" as const, 
        content: data.answer, 
        timestamp 
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Optionally save to chat history
      await fetch('/api/chat/history', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage, assistantMessage],
        }),
      });

    } catch (err) {
      const errorMessage = { 
        role: "assistant" as const, 
        content: "Something went wrong. Please try again.", 
        timestamp 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    setMessages([]);
    
    // Clear chat history from server
    if (isLoggedIn) {
      try {
        await fetch('/api/chat/history', {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to clear chat history:', error);
      }
    }
  };

  const noMessages = messages.length === 0;

  // Show loading state while checking authentication
  if (isPending) {
    return (
      <div className="h-[60vh] w-[60vh] radial-bg flex items-center justify-center overflow-auto rounded-xl z-50 fixed bottom-15 right-10">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="h-[60vh] w-[60vh] radial-bg flex overflow-auto rounded-xl z-50 fixed bottom-15 right-10">
        <LoginPrompt onClose={onClose} />
      </div>
    );
  }

  return (
    <div className="md:h-[60vh] md:w-[60vh] border border-[#00FF00]/30 radial-bg-dark flex overflow-auto rounded-xl z-50 fixed bottom-5 right-5">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Bar */}
        <header className="border-b border-gray-800 shadow-md radial-bg-dark px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-400">Today</span>
          </div>
          <div className="flex flex-row gap-4">
            <SquarePenIcon 
              className="h-4 w-4 text-gray-500 cursor-pointer hover:text-green-500 transition-colors" 
              onClick={handleClearChat}
              title="New Chat"
            />
            <MinusIcon
              className="h-4 w-4 text-gray-500 cursor-pointer hover:text-red-500 transition-colors"
              onClick={() => onClose && onClose()}
              title="Close"
            />
          </div>
        </header>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="md:max-w-3xl mx-auto">
            {noMessages ? (
              <div className="flex flex-col items-center justify-center space-y-8">
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="bg-green-600/10 rounded-full border border-green-500">
                      <motion.img
                        src="./ben10.png"
                        width={64}
                        height={64}
                        alt="Ben10"
                      />
                    </div>
                  </div>
                  <h2 className=" md:text-2xl font-bold text-white">
                    Meet assist10!
                  </h2>
                  <p className="text-sm md:text-base text-gray-400 max-w-md">
                    Ask me anything about Ben 10 alien explorer!
                  </p>
                  {session?.user?.name && (
                    <p className="text-xs text-green-500">
                      Welcome back, {session.user.name}!
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6 pb-24">
                {messages.map((m, i) => (
                  <Bubble key={i} message={m} />
                ))}
                {loading && <LoadingBubble />}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-800 shadow-md -bg-dark p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="md:max-w-3xl mx-auto"
          >
            <div className="flex gap-2 radial-bg-dark border border-gray-700 rounded-full p-2 focus-within:border-green-500/50 transition-colors">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about something..."
                disabled={loading}
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-gray-500"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                size="icon"
                className="bg-green-600 hover:bg-green-500 disabled:bg-gray-700 shrink-0 rounded-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}