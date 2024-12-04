"use client"

import { UserButton, useAuth } from "@clerk/nextjs";
import GoalTreeNodeView from "@/components/goaltree/GoalTreeNodeView";

export default function Dashboard() {
  const { userId, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return null;
  }

  if (!userId) {
    redirect("/");
  }

  return (
    <div>
      <header className="flex justify-between p-4">
        <h1>Dashboard</h1>
        <UserButton afterSignOutUrl="/"/>
      </header>
      <GoalTreeNodeView />
    </div>
  );
}
