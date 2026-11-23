// Seamless, gently drifting wave edge: the curved section borders from the
// original site, now alive. Two layers at different speeds give depth.

const PATH =
  "M0,40 C240,90 480,-10 720,40 C960,90 1200,-10 1440,40 C1680,90 1920,-10 2160,40 C2400,90 2640,-10 2880,40 L2880,0 L0,0 Z";

export default function Wave({
  fill,
  position,
  className = "",
}: {
  fill: string;
  position: "top" | "bottom";
  className?: string;
}) {
  const flip = position === "bottom";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 z-10 h-16 overflow-hidden sm:h-20 ${flip ? "bottom-0 translate-y-px rotate-180" : "top-0 -translate-y-px"} ${className}`}
    >
      <svg className="absolute left-0 top-0 h-full w-[200%] animate-wave-slow opacity-40" viewBox="0 0 2880 80" preserveAspectRatio="none">
        <path d={PATH} fill={fill} transform="translate(0,10)" />
      </svg>
      <svg className="absolute left-0 top-0 h-full w-[200%] animate-wave" viewBox="0 0 2880 80" preserveAspectRatio="none">
        <path d={PATH} fill={fill} />
      </svg>
    </div>
  );
}
