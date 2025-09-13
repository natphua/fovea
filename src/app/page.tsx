"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/*
 * Home Page
 * Redirects to dashboard on load
 */
export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to /dashboard when the component mounts
    router.push("/dashboard");
  }, [router]);
  
  return <div></div>;
}