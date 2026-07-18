import FaIcon from "@/components/FaIcon";

/** Shared subject progress treatment used on both universe cards and world headers. */
export default function WorldProgressBar({
  value,
  max,
  accent,
  chip,
  ariaLabel,
  className = "",
}: {
  value: number;
  max: number;
  accent: string;
  chip: string;
  ariaLabel: string;
  className?: string;
}) {
  const progress = max > 0 ? Math.round((value / max) * 100) : 0;
  const complete = max > 0 && value >= max;

  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`lu-world-progress ${className}`}
      data-complete={complete || undefined}
      style={{
        borderColor: `${accent}66`,
        background: `linear-gradient(180deg, ${chip}, #f8f6fc)`,
      }}
    >
      <span
        className="lu-world-progress-fill"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${accent}, #FFD64D, ${accent})`,
          boxShadow: `0 0 10px ${accent}66`,
        }}
      />
      {max > 1 && (
        <span className="lu-world-progress-milestones" aria-hidden="true">
          {Array.from({ length: max - 1 }, (_, marker) => (
            <span key={marker} style={{ left: `${((marker + 1) / max) * 100}%` }} />
          ))}
        </span>
      )}
      {value > 0 && (
        <span
          className="lu-world-progress-marker"
          aria-hidden="true"
          style={{
            left: complete ? "calc(100% - 8px)" : `${progress}%`,
            color: accent,
          }}
        >
          <FaIcon name={complete ? "crown" : "star"} />
        </span>
      )}
    </div>
  );
}
