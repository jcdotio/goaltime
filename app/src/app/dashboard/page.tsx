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
      <span className="inline-flex items-center">
      <h1 className="text-xl font-semibold">
          <div className="text-xl font-bold space-y-2">
          <span className="inline-flex items-center">
          <span className="-translate-y-0.5">🎯</span> {/* Adjust the Y translation */}
          <span className="ml-1">GoalTimeMoney</span>
          </span>
        </div>
          </h1>
      </span>
        <UserButton afterSignOutUrl="/" />
      </header>
      <GoalTreeNodeView />
    </div>
  );
}