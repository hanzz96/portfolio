import { useEffect, useState } from "react";

const QUEST_CHECKPOINTS = [
  { id: "work", label: "Mission Log" },
  { id: "experience", label: "Campaign Timeline" },
  { id: "process", label: "Skill Loadout" },
  { id: "contact", label: "Next Mission" },
];

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [waypoints, setWaypoints] = useState([]);

  useEffect(() => {
    function computeWaypoints(scrollable) {
      if (scrollable <= 0) return [];
      return QUEST_CHECKPOINTS.map((checkpoint) => {
        const el = document.getElementById(checkpoint.id);
        const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
        return { ...checkpoint, percent: Math.min(100, Math.max(0, (top / scrollable) * 100)) };
      });
    }

    function handleScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0);
    }

    function handleResize() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setWaypoints(computeWaypoints(scrollable));
      handleScroll();
    }

    handleResize();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const level = 1 + waypoints.filter((w) => progress >= w.percent - 1).length;
  const currentWaypoint = [...waypoints].reverse().find((w) => progress >= w.percent - 1);

  return { progress, waypoints, level, currentLabel: currentWaypoint?.label ?? "Player Home" };
}
