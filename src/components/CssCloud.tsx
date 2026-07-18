import { useId, type CSSProperties } from "react";

type CloudVariant = "puffy" | "wide" | "small";

const CLOUD_SHAPES: Record<CloudVariant, string> = {
  puffy:
    "M13 113C7 101 16 90 32 91C28 74 41 60 59 61C61 42 76 28 96 29C108 7 138 4 156 27C178 13 207 24 215 48C235 39 258 50 263 69C284 64 304 77 304 94C327 91 345 103 343 116C309 122 49 124 13 113Z",
  wide:
    "M10 114C6 102 19 93 35 94C35 79 50 68 68 70C77 50 99 43 120 51C136 28 170 27 189 50C211 39 237 49 244 69C264 63 285 75 287 91C313 88 337 101 344 115C317 123 36 123 10 114Z",
  small:
    "M12 114C8 103 20 94 36 95C39 77 55 66 73 69C84 44 115 36 137 53C155 32 189 35 204 58C223 48 247 58 252 76C276 70 301 82 303 100C324 98 340 106 344 116C303 123 44 123 12 114Z",
};

const UNDERSIDE =
  "M13 107C31 102 45 111 59 108C74 101 88 113 103 111C119 104 135 120 151 115C167 107 181 123 198 116C214 107 229 120 246 114C264 105 277 116 292 111C311 103 330 108 344 116C338 130 320 132 303 124C291 140 264 140 247 127C230 143 204 143 188 129C168 143 144 140 132 126C111 140 87 135 80 122C58 134 30 128 13 116Z";

export default function CssCloud({
  variant = "puffy",
  className = "",
  style,
}: {
  variant?: CloudVariant;
  className?: string;
  style?: CSSProperties;
}) {
  const clipId = `lu-cloud-${useId().replaceAll(":", "")}`;

  return (
    <svg
      className={`lu-css-cloud is-${variant} ${className}`}
      style={style}
      viewBox="0 0 360 150"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={CLOUD_SHAPES[variant]} />
        </clipPath>
      </defs>
      <path className="lu-cloud-underside" d={UNDERSIDE} />
      <path className="lu-cloud-body" d={CLOUD_SHAPES[variant]} />

      <g clipPath={`url(#${clipId})`}>
        <path
          className="lu-cloud-shade lu-cloud-shade-a"
          d="M45 82C65 95 91 98 115 82C102 103 68 108 45 82Z"
        />
        <path
          className="lu-cloud-shade lu-cloud-shade-b"
          d="M123 91C147 104 177 105 202 87C187 112 147 115 123 91Z"
        />
        <path
          className="lu-cloud-shade lu-cloud-shade-c"
          d="M214 84C235 98 260 99 282 83C269 105 237 109 214 84Z"
        />
        <path
          className="lu-cloud-shade lu-cloud-shade-d"
          d="M283 96C299 104 316 104 331 95C321 111 298 113 283 96Z"
        />

        <path
          className="lu-cloud-highlight"
          d="M98 54C116 35 140 29 160 40C139 36 117 42 103 59Z"
        />
      </g>
    </svg>
  );
}
