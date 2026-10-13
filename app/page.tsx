"use client";
import Music from "@/components/Music";

export default function Home() {
  return (
    <div className="relative flex items-center justify-center h-screen w-screen overflow-hidden">
      <div className="liquid-bg" aria-hidden="true" />
      <Music />
    </div>
  );
}
