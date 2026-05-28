import { useId } from "react";

interface MapPinAvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function MapPinAvatar({
  src,
  alt: _alt,
  size = 36,
  className,
  style,
}: MapPinAvatarProps) {
  const clipId = useId();

  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 24 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="12" cy="12" r="8" />
        </clipPath>
      </defs>

      {/* Photo clipped into the hollow center */}
      <image
        x="4"
        y="4"
        width="16"
        height="16"
        href={src}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />

      {/* Teardrop pin shape with center cutout via evenodd */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C5.373 0 0 5.373 0 12c0 8.25 12 18 12 18s12-9.75 12-18C24 5.373 18.627 0 12 0zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
        fill="white"
      />
    </svg>
  );
}
