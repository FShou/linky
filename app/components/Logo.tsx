
export default function Logo({
  size = 32,
  strokeColor = "white",
  strokeWidth = 2,
  gradientColors = ["#0A0A0A", "#7F1D1D"],
  gradientOpacity = [0.9, 1],
  borderRadius = 8,
}: {
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
  gradientColors?: [string, string];
  gradientOpacity?: [number, number];
  borderRadius?: number;
}) {
  const scaledPathTransform = `scale(${size / 32})`; // Scale relative to the base size (32)

  return (

  <div className="p-[6px] border shadow rounded-[10px] backdrop-blur-sm bg-gradient-to-br from-red-900/10 to-primary/10">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
    >
      {/* Background rectangle with customizable gradient */}
      <rect
        width={size}
        height={size}
        rx={borderRadius}
        fill="url(#paint0_linear)"
      />
      <g clipPath="url(#clip0)" transform={scaledPathTransform}>
        {/* Top path */}
        <path
          d="M14.3333 16.8333C14.6912 17.3118 15.1478 17.7076 15.6721 17.9941C16.1965 18.2806 16.7763 18.4509 17.3722 18.4936C17.9682 18.5363 18.5663 18.4503 19.1261 18.2415C19.6859 18.0327 20.1943 17.7059 20.6167 17.2833L23.1167 14.7833C23.8757 13.9975 24.2956 12.945 24.2861 11.8525C24.2766 10.76 23.8384 9.71495 23.0659 8.94242C22.2934 8.16989 21.2483 7.73168 20.1558 7.72219C19.0634 7.71269 18.0108 8.13267 17.225 8.89166L15.7917 10.3167"
          stroke={strokeColor}
          strokeWidth={strokeWidth} // Adjust stroke width dynamically
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bottom path */}
        <path
          d="M17.6667 15.1667C17.3088 14.6882 16.8522 14.2923 16.3279 14.0059C15.8035 13.7194 15.2237 13.5491 14.6278 13.5064C14.0318 13.4637 13.4337 13.5497 12.8739 13.7585C12.3141 13.9673 11.8057 14.2941 11.3833 14.7167L8.88333 17.2167C8.12434 18.0025 7.70436 19.055 7.71386 20.1475C7.72335 21.24 8.16156 22.285 8.93409 23.0576C9.70662 23.8301 10.7517 24.2683 11.8442 24.2778C12.9366 24.2873 13.9892 23.8673 14.775 23.1083L16.2 21.6833"
          stroke={strokeColor}
          strokeWidth={strokeWidth} // Adjust stroke width dynamically
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        {/* Dynamic gradient */}
        <linearGradient
          id="paint0_linear"
          x1={size * 0.71875} // Adjusted for size
          y1={size * 0.703125}
          x2={size * 0.046875}
          y2={0}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={gradientColors[0]} stopOpacity={gradientOpacity[0]} />
          <stop offset="1" stopColor={gradientColors[1]} stopOpacity={gradientOpacity[1]} />
        </linearGradient>
        <clipPath id="clip0">
          <rect
            width={20}
            height={20}
            fill="white"
            transform="translate(6 6)"
          />
        </clipPath>
      </defs>
    </svg>
    </div>
  );
}
