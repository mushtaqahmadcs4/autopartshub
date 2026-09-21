import React from "react";
import Link from "next/link";
import { ShieldAlert, Wrench, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-neutral-900 border border-neutral-700 p-2 rounded-full text-zinc-400">
          <Wrench className="w-5 h-5" />
        </div>
      </div>

      <span className="text-xs uppercase tracking-widest text-red-500 font-semibold mb-2">
        Access Denied
      </span>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
        Restricted Garage Area
      </h1>

      <p className="text-zinc-400 max-w-md mb-8 text-sm md:text-base leading-relaxed">
        You don't have the necessary admin permissions to access this page.
        Please sign in with an authorized administrator account to manage inventory.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-medium px-5 py-2.5 rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-red-600/20"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}