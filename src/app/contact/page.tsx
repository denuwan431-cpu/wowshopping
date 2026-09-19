"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle2, Send } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export default function ContactPage() {
  const { theme } = useTheme();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">GET IN TOUCH</span>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900">Contact Us</h1>
        <p className="text-xs text-slate-500">
          Our Colombo atelier and customer care specialists are available 6 days a week to assist with order tracking, garment sizing, or custom DTF artwork inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
              Customer Hotlines
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Telephone Hotline</span>
                  <p>{theme.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">WhatsApp Sizing Support</span>
                  <a href={`https://wa.me/${theme.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-green-700 hover:underline">
                    {theme.whatsapp}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Customer Care Email</span>
                  <p>{theme.contactEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Studio & Headquarters</span>
                  <p>{theme.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">Opening Hours</span>
                  <p>{theme.businessHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for reaching out. One of our apparel specialists will review your inquiry and get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                Send Us a Direct Message
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Name *</label>
                  <input type="text" required placeholder="Dulani Perera" className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Email *</label>
                  <input type="email" required placeholder="email@example.com" className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input type="tel" placeholder="+94 77 123 4567" className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Subject</label>
                  <select className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none bg-white">
                    <option>General Sizing Inquiry</option>
                    <option>Order Tracking & Courier</option>
                    <option>Custom DTF Bulk Merch Quote</option>
                    <option>Return / Exchange Request</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Message *</label>
                <textarea rows={4} required placeholder="Write your message here..." className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
