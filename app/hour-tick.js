"use client";
import { useEffect, useState } from "react";
import { msUntilNextHour } from "@/lib/hour";
export default function HourTick({ label }) {
  const [left, setLeft] = useState("");
  useEffect(() => {
    function tick() {
      const ms = msUntilNextHour();
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setLeft(`${m}m ${String(s).padStart(2, "0")}s until the next turn`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (<p className="tick">{label}<br />{left}</p>);
}
