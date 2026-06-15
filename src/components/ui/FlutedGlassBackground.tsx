export function FlutedGlassBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <img
        src="/skyline.webp"
        alt=""
        className="h-full w-full object-cover"
      />
    </div>
  );
}
