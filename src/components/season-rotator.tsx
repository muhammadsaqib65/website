"use client";

import { useEffect, useState } from "react";

const words = ["Summer Drop", "Handmade Edit", "Luxury Basics", "Festive Wear"];

export function SeasonRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-sm font-semibold text-amber-800">
      Now Highlighting: <span className="inline-block min-w-36 animate-fade-in-up">{words[index]}</span>
    </p>
  );
}
