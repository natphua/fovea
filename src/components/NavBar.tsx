"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

export default function NavBar() {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="navbar bg-base-100 px-4 lg:px-8">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl font-bold">
          🔍 Fovea
        </Link>
      </div>

      <div className="navbar-end">
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            {!user && (
              <>
                <li>
                  <Link href="/measure" className="btn btn-ghost font-medium">
                    Measure Your Focus
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="btn btn-ghost font-medium">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="btn btn-ghost font-medium">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="btn btn-ghost font-medium">
                    Contact Us
                  </Link>
                </li>
              </>
            )}
            
            {user ? (
              <div className="flex items-center gap-2">
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-content" />
                    </div>
                  </div>
                  <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300">
                    <li className="menu-title">
                      <span>{user.email}</span>
                    </li>
                    <li>
                      <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link href="/session">Start Session</Link>
                    </li>
                    <li>
                      <button onClick={handleSignOut} className="text-error">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              !loading && (
                <li>
                  <Link href="/auth/login" className="btn btn-primary">
                    Sign In
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
