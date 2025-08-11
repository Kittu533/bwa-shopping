"use client";
import { Button } from "@/components/ui/button";

function toDashboard() {
  // Navigate to the dashboard
  window.location.href = "/dashboard";
}

export default function Home() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button onClick={toDashboard}>Button</Button>
    </div>
  );
}
