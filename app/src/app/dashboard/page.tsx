"use client"

import { UserButton, useAuth } from "@clerk/nextjs";
import GoalTreeNodeView from "@/components/goaltree/GoalTreeNodeView";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/');
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <div>
      <header className="flex justify-between p-4">
        <h1>🎯 GoalTimeMoney</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <GoalTreeNodeView />
    </div>
  );
}