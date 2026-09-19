"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  Heart,
  LogOut,
  Package,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";

interface AccountClientProps {
  initialUser: any | null;
  initialOrders: any[];
}

export function AccountClient({
  initialUser,
  initialOrders
}: AccountClientProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const [currentUser, setCurrentUser] = useState(initialUser);
  const [orders, setOrders] = useState(initialOrders);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        router.refresh();
      } else {
        setErrorMsg(data.message || "Invalid credentials");
      }
    } catch {
      setErrorMsg("Network error logging in");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        router.refresh();
      } else {
        setErrorMsg(data.message || "Registration failed");
      }
    } catch {
      setErrorMsg("Network error registering");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, password: testPass })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        router.refresh();
      }
    } catch {
      setErrorMsg("Error logging in");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    router.refresh();
  };

  // If user is logged in: show dashboard
  if (currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 text-amber-400 font-black text-xl flex items-center justify-center font-heading">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                LOGGED IN AS {currentUser.role?.toUpperCase()}
              </span>
              <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                {currentUser.name}
              </h1>
              <p className="text-xs text-slate-500">{currentUser.email} • {currentUser.phone || "No phone linked"}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {currentUser.role?.includes("admin") || currentUser.role?.includes("manager") ? (
              <Link
                href="/admin"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition"
              >
                Go to Admin Panel
              </Link>
            ) : null}
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recent Orders List */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" />
                Order History ({orders.length})
              </h2>
            </div>

            {orders.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs space-y-3">
                <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
                <p>You haven't placed any orders yet.</p>
                <Link
                  href="/shop"
                  className="inline-block px-5 py-2 bg-slate-900 text-white rounded-md text-xs font-bold uppercase tracking-wider"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <div key={o.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-slate-900 text-sm">{o.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800">
                          {o.orderStatus}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-1">
                        Placed on {formatDate(o.createdAt)} • Tracking: <span className="font-mono text-slate-700 font-semibold">{o.trackingNumber}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-black text-slate-900 text-sm">
                        {formatPrice(o.total, theme.currencySymbol)}
                      </span>
                      <Link
                        href={`/checkout/confirmation?orderNumber=${o.orderNumber}`}
                        className="px-3 py-1.5 border border-slate-300 rounded-md font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        View Invoice
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Quick Links & Address */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                Default Shipping Address
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dulani Perera<br />
                406/B2/1 Thalagala Junction<br />
                Homagama, 10200<br />
                Sri Lanka
              </p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl space-y-2 text-xs text-amber-900">
              <h4 className="font-bold uppercase tracking-wider text-[11px]">Islandwide Hotline Support</h4>
              <p className="text-slate-600">
                Have questions regarding custom DTF artwork or an active courier shipment?
              </p>
              <a
                href={`tel:${theme.phone}`}
                className="font-black text-slate-950 block hover:underline pt-1"
              >
                Hotline: {theme.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not logged in: display Login / Register screen inspired by screenshot 1 & 9
  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black font-heading text-slate-900">My Account</h1>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 text-center font-bold text-sm">
          <button
            onClick={() => setAuthMode("login")}
            className={`flex-1 pb-3 transition ${
              authMode === "login"
                ? "border-b-2 border-slate-900 text-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Log in
          </button>
          <button
            onClick={() => setAuthMode("register")}
            className={`flex-1 pb-3 transition ${
              authMode === "register"
                ? "border-b-2 border-slate-900 text-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
            {errorMsg}
          </div>
        )}

        {authMode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Username or email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <span className="text-[11px] text-amber-600 cursor-pointer hover:underline">Forgot password?</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-lime-600 hover:bg-lime-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-sm"
            >
              {loading ? "LOGGING IN..." : "Log in"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Create Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-sm"
            >
              {loading ? "CREATING ACCOUNT..." : "Register"}
            </button>
          </form>
        )}

        {/* 1-Click Fast Demo Credentials (For instant testing) */}
        <div className="pt-4 border-t border-slate-200 space-y-2 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Demo 1-Click Test Login
          </span>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@auraapparel.lk", "admin123#Secure")}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-lg transition"
            >
              Sign In as Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("dulani@example.com", "customer123#")}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition"
            >
              Sign In as Customer (Dulani)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
