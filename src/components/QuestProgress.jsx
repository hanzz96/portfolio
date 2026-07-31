import { useScrollProgress } from "../hooks/useScrollProgress.js";

export function QuestProgress() {
  const { progress, waypoints, level, currentLabel } = useScrollProgress();
  const hudThreshold = waypoints[0]?.percent ?? 15;

  return (
    <>
      <div className={`quest-hud ${progress > hudThreshold ? "is-active" : ""}`}>
        <span className="quest-hud-level">LV {level}</span>
        <span className="quest-hud-label">{currentLabel}</span>
      </div>
      <div
        className="scroll-progress"
        role="progressbar"
        aria-label="Quest progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="scroll-progress-fill" style={{ width: `${progress}%` }} />
        {waypoints.map((waypoint) => (
          <span
            key={waypoint.id}
            className={`scroll-waypoint ${progress >= waypoint.percent - 1 ? "is-passed" : ""}`}
            style={{ left: `${waypoint.percent}%` }}
            title={waypoint.label}
          />
        ))}
        <span className="scroll-marker" style={{ left: `${progress}%` }} aria-hidden="true" />
      </div>
    </>
  );
}
