'use client';

import { useState } from 'react';
import { POST } from '../api/chat/route';
import { NextResponse } from 'next/server';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !feedback) return;
    
    setIsSubmitting(true);
    
    try{
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ email, comment: feedback }),
      });

      if(!res.ok){
        const string = await res.json();
        alert('The submission was failed!');
      }
      else{
        setEmail('');
        setFeedback('');
        alert('Thank you for your feedback!');
      }
    } catch (error) {
      console.error("Error saving feedback", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-black z-10 border-t bottom-0 left-0 right-0 border-[#00FF00]/20 py-12 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-12 mb-12">

          {/* Feedback Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#00FF00]">
              Feedback & Suggestions
            </h3>

            <p className="text-gray-400 text-sm">
              Your feedback helps improve this project.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-[#00FF00]/30 
                         focus:outline-none focus:border-[#00FF00] transition-colors text-sm"
              />
              <textarea
                placeholder="Your feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-[#00FF00]/30 
                         focus:outline-none focus:border-[#00FF00] transition-colors text-sm resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#00FF00] hover:bg-[#00DD00] text-black font-bold px-6 py-2 rounded-md 
                         transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>

          {/* Disclaimer Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#00FF00]">
              Disclaimer
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed">
              This is a <span className="text-white font-medium">fan-made project</span> for 
              educational and portfolio purposes only. All Ben 10 characters, images, and references 
              are property of <span className="text-white font-medium">Cartoon Network</span> and{' '}
              <span className="text-white font-medium">Man of Action Studios</span>.
            </p>

            <p className="text-gray-500 text-xs">
              Not affiliated with or endorsed by Cartoon Network. This project demonstrates 
              frontend development and UI design skills.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#00FF00]/10 text-center">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Ben 10 Alien Explorer — Fan Project
          </p>
        </div>

      </div>
    </footer>
  );
}