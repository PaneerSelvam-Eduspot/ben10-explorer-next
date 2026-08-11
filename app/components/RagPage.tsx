"use client";

import { useState, useEffect, useRef } from "react";
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
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────
type Message = {
  role: "user" | "assistant";
  
  content: string;
  timestamp?: string;
  isError?: boolean;
};

// ── Error classifier ──────────────────────────────────────────────────────────
function getErrorMessage(status: number): string {
  switch (status) {
    case 401:
      return "Your session has expired. Please log in again.";
    case 429:
      return "You've sent too many messages. Please wait a moment before trying again.";
    case 400:
      return "Your message couldn't be processed. Please try rephrasing.";
    case 500:
    default:
      return "Something went wrong on our end. Please try again shortly.";
  }
}

// ── LoadingBubble ─────────────────────────────────────────────────────────────
const LoadingBubble = () => (
  <div className="flex gap-3 items-start">
    <div className="h-7 w-7 bg-[#006A4E] shrink-0 rounded-full overflow-hidden">
      <img src="./ben10.png" alt="assist10" className="w-full h-full object-cover" />
    </div>
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin text-green-500" />
      <span className="text-sm text-gray-400">Thinking...</span>
    </div>
  </div>
);

// ── Bubble ────────────────────────────────────────────────────────────────────
const Bubble = ({
  message,
  userName,
}: {
  message: Message;
  userName?: string | null;
}) => {
  const { content, role, timestamp, isError } = message;
  const isUser = role === "user";
  const initial = userName?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <motion.div
          className="h-7 w-7 bg-[#006A4E] shrink-0 rounded-full overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <img src="./ben10.png" alt="assist10" className="w-full h-full object-cover" />
        </motion.div>
      )}

      <div className="max-w-[85%] md:max-w-[70%]">
        <motion.div
          className={`rounded-lg p-3 ${
            isUser
              ? "bg-black/70 text-white"
              : isError
              ? "bg-amber-900/30 text-amber-200 border border-amber-700/50"
              : "bg-gray-800/50 text-gray-100 border border-gray-700/50"
          }`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isError && (
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="text-xs text-amber-400 font-medium">Notice</span>
            </div>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        </motion.div>
        {timestamp && (
          <span className="text-xs text-gray-500 mt-1 block">{timestamp}</span>
        )}
      </div>

      {isUser && (
        <motion.div
          className="h-7 w-7 shrink-0 rounded-full bg-[#006A4E] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-xs text-white font-bold">{initial}</span>
        </motion.div>
      )}
    </div>
  );
};

// ── LoginPrompt ───────────────────────────────────────────────────────────────
const LoginPrompt = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col radial-bg-dark items-center justify-center h-full space-y-6 p-8">
      <div className="bg-green-600/10 rounded-full p-6 border border-green-500">
        <Lock className="h-12 w-12 text-green-500" />
      </div>
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-white">Authentication Required</h2>
        <p className="text-sm text-gray-400 max-w-md">
          Please log in to access Assist10 and get personalized help about Ben 10 aliens!
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={() => router.push("/login")}
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

// ── RagPage ───────────────────────────────────────────────────────────────────
export default function RagPage({ onClose }: { onClose?: () => void }) {
  const { data: session, isPending } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!session?.user;
  const userId = session?.user?.id;
  const userName = session?.user?.name ?? null;

  // ── Load chat history on mount ──────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn || !userId) {
      setMessages([]);
      return;
    }
    const loadChatHistory = async () => {
      try {
        const response = await fetch("/api/chat/history");
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };
    loadChatHistory();
  }, [isLoggedIn, userId]);

  // ── Auto-scroll on every message/token update ───────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = async (text: string) => {
    if (!text.trim() || !isLoggedIn || loading) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage: Message = { role: "user", content: text, timestamp };

    // Snapshot BEFORE pushing userMessage — this is the history context for the server
    const historySnapshot = [...messages];

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          history: historySnapshot,
        }),
      });

      // Non-2xx — server returns JSON error body, parse and show specifically
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: errorData.error ?? getErrorMessage(res.status),
            timestamp,
            isError: true,
          },
        ]);
        return;
      }

      // ── Stream reading ──────────────────────────────────────────────────────
      // toTextStreamResponse() sends raw plain text chunks — no protocol prefix.
      // Push an empty assistant bubble immediately, then fill it token by token.
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", timestamp },
      ]);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Raw text chunk — append directly, no `0:` prefix to strip
        fullText += decoder.decode(value, { stream: true });

        // Update the last message (the streaming assistant bubble) in place
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: fullText,
            timestamp,
          };
          return updated;
        });
      }

      // ── Flush decoder at end of stream ──────────────────────────────────────
      // decode() with no args flushes any remaining bytes held in the decoder buffer
      const tail = decoder.decode();
      if (tail) {
        fullText += tail;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: fullText,
            timestamp,
          };
          return updated;
        });
      }

    } catch {
      // Network-level failure — offline, DNS, etc.
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Unable to reach the server. Please check your connection.",
          timestamp,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ── Clear chat ──────────────────────────────────────────────────────────────
  const handleClearChat = async () => {
    setMessages([]);
    if (isLoggedIn) {
      try {
        await fetch("/api/chat/history", { method: "DELETE" });
      } catch (error) {
        console.error("Failed to clear chat history:", error);
      }
    }
  };

  // ── Render guards ───────────────────────────────────────────────────────────
  if (isPending) {
    return (
      <div className="h-[60dvh] w-[min(60vh,calc(100vw-2rem))] radial-bg flex items-center justify-center rounded-xl z-50 fixed bottom-5 right-5">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="h-[60dvh] w-[min(60vh,calc(100vw-2rem))] radial-bg flex rounded-xl z-50 fixed bottom-5 right-5">
        <LoginPrompt onClose={onClose} />
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="h-[60dvh] w-[min(60vh,calc(100vw-2rem))] border border-[#00FF00]/30 radial-bg-dark flex flex-col rounded-xl z-50 fixed bottom-5 right-5">

      {/* Top Bar */}
      <header className="border-b border-gray-800 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-400">Today</span>
        </div>
        <div className="flex flex-row gap-4">
          <button
            type="button"
            onClick={handleClearChat}
            aria-label="New Chat"
            className="text-gray-500 hover:text-green-500 transition-colors"
          >
            <SquarePenIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onClose?.()}
            aria-label="Close"
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="md:max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-8 pt-8">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="bg-green-600/10 rounded-full border border-green-500 overflow-hidden">
                    <motion.img
                      src="./ben10.png"
                      width={64}
                      height={64}
                      alt="Ben10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
                <h2 className="md:text-2xl font-bold text-white">
                  Meet Assist10!
                </h2>
                <p className="text-sm md:text-base text-gray-400 max-w-md">
                  Ask me anything about Ben 10 alien explorer!
                </p>
                {userName && (
                  <p className="text-xs text-green-500">
                    Welcome back, {userName}!
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {messages.map((m, i) => (
                <Bubble key={i} message={m} userName={userName} />
              ))}
              {/* LoadingBubble only shows between send and first token arriving */}
              {loading && messages[messages.length - 1]?.role !== "assistant" && (
                <LoadingBubble />
              )}
              {/* Scroll anchor */}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4 shrink-0">
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
  );
}
