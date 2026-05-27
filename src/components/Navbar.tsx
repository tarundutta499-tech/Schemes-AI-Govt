"use client";

import Link from "next/link";
import { Globe, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";

export function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-brand-600 text-white p-1.5 rounded-lg">
            <Globe className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">
            SchemeSathi<span className="text-brand-600">AI</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/wizard" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
            Scheme Workspace
          </Link>
          <Link href="/jobs" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors flex items-center gap-1">
            <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">New</span>
            Jobs Workspace
          </Link>
          {user && (
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
              Dashboard
            </Link>
          )}
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
            <Globe className="w-4 h-4" />
            <span>EN / HI</span>
          </button>
          
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-sm font-medium text-gray-600 truncate max-w-[120px]">
                {user.email}
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm shadow-brand-600/20"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
