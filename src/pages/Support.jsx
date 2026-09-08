import React, { useState } from 'react';
import {
  Mail,
  Send,
  MessageCircle,
  Clock,
  CheckCircle2,
  Headphones,
  ExternalLink,
} from 'lucide-react';
import { CONTACT_CONFIG } from '../config/contact';
import { Disclaimer } from '../components/Disclaimer';

export const Support = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderId: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-3.5 py-4 space-y-5 select-none">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-blue-50 text-xs font-bold text-[#0095F6]">
          <Headphones className="w-3.5 h-3.5" />
          <span>Customer Help Desk</span>
        </div>
        <h1 className="text-3xl font-black text-[#0F1419] tracking-tight">
          We’re Here to Help
        </h1>
        <p className="text-sm text-[#737373]">
          Get in touch with our verification advisory team via your preferred channel.
        </p>
      </div>

      {/* 3 Contact Channel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WhatsApp Card */}
        <a
          href={CONTACT_CONFIG.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-lg border border-[#DBDBDB] p-6 shadow-xs hover:shadow-md hover:border-[#25D366] transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-sm bg-emerald-50 text-[#25D366] flex items-center justify-center transition-transform group-hover:scale-105">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0F1419]">WhatsApp Support</h3>
              <p className="text-xs text-[#737373] mt-0.5">
                Instant chat with our onboarding specialists.
              </p>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>{CONTACT_CONFIG.whatsappDisplay}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </a>

        {/* Telegram Card */}
        <a
          href={CONTACT_CONFIG.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-lg border border-[#DBDBDB] p-6 shadow-xs hover:shadow-md hover:border-[#0088cc] transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-sm bg-sky-50 text-[#0088cc] flex items-center justify-center transition-transform group-hover:scale-105">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0F1419]">Telegram Support</h3>
              <p className="text-xs text-[#737373] mt-0.5">
                Direct community channel and updates.
              </p>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-sky-600">
            <span>{CONTACT_CONFIG.telegramDisplay}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </a>

        {/* Email Card */}
        <a
          href={CONTACT_CONFIG.emailUrl}
          className="bg-white rounded-lg border border-[#DBDBDB] p-6 shadow-xs hover:shadow-md hover:border-[#0095F6] transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-sm bg-blue-50 text-[#0095F6] flex items-center justify-center transition-transform group-hover:scale-105">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0F1419]">Email Support</h3>
              <p className="text-xs text-[#737373] mt-0.5">
                Official inquiries and case reviews.
              </p>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#0095F6]">
            <span>{CONTACT_CONFIG.email}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </a>
      </div>

      {/* Operating Hours Info Strip */}
      <div className="bg-neutral-50 rounded-lg border border-[#DBDBDB] p-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#0095F6]" />
          <span><strong>Hours:</strong> {CONTACT_CONFIG.supportHours}</span>
        </div>
        <div className="text-[11px]">
          {CONTACT_CONFIG.responseTime}
        </div>
      </div>

      {/* Direct Ticket Submission Form */}
      <div className="bg-white rounded-lg border border-[#DBDBDB] p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#0F1419]">
            Send an Inquiry Ticket
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Fill out the form below and our team will get back to you within 4 business hours.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-emerald-950">
              Inquiry Received!
            </h3>
            <p className="text-xs text-emerald-800 max-w-sm mx-auto">
              Thank you for reaching out. A case ticket has been registered and a specialist will email you shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs font-bold text-emerald-700 underline pt-2 cursor-pointer"
            >
              Submit another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#0F1419]">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Sharma"
                  className="w-full p-2.5 rounded-sm border border-[#DBDBDB] bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-[#0095F6] outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#0F1419]">Your Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full p-2.5 rounded-sm border border-[#DBDBDB] bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-[#0095F6] outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0F1419]">
                Order ID or Instagram Username (Optional)
              </label>
              <input
                type="text"
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                placeholder="e.g. VA-928415 or @yourhandle"
                className="w-full p-2.5 rounded-sm border border-[#DBDBDB] bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-[#0095F6] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0F1419]">Message / How can we help?</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your question or issue..."
                className="w-full p-2.5 rounded-sm border border-[#DBDBDB] bg-neutral-50/50 text-xs font-medium focus:bg-white focus:border-[#0095F6] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0095F6] hover:bg-[#0081d6] active:scale-95 text-white font-bold py-3 rounded-sm shadow-xs transition-all text-xs cursor-pointer"
            >
              Submit Ticket
            </button>
          </form>
        )}
      </div>

      <Disclaimer variant="subtle" />
    </div>
  );
};

export default Support;
