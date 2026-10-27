import { computed, onMounted, onUnmounted, ref } from "vue";

const QUEST_CHECKPOINTS = [
  { id: "work", label: "Mission Log" },
  { id: "experience", label: "Campaign Timeline" },
  { id: "process", label: "Skill Loadout" },
  { id: "contact", label: "Next Mission" },
];

export function useScrollProgress() {
  const progress = ref(0);
  const waypoints = ref([]);

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
    progress.value = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
  }

  function handleResize() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    waypoints.value = computeWaypoints(scrollable);
    handleScroll();
  }

  onMounted(() => {
    handleResize();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleResize);
  });

  const level = computed(() => 1 + waypoints.value.filter((w) => progress.value >= w.percent - 1).length);
  const currentLabel = computed(() => {
    const current = [...waypoints.value].reverse().find((w) => progress.value >= w.percent - 1);
    return current?.label ?? "Player Home";
  });

  return { progress, waypoints, level, currentLabel };
}
