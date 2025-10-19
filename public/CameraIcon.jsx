import React from "react";

export default function CameraIcon({ size = 48, color = "black" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={color}
      strokeWidth="1.2"
      strokeMiterlimit="10"
    >
      <rect x="3.38" y="3.38" width="17.25" height="3.83" />
      <line x1="0.5" y1="3.38" x2="23.5" y2="3.38" />
      <path d="M4.33,7.21H19.67V13A7.67,7.67,0,0,1,12,20.63A7.67,7.67,0,0,1,4.33,13V7.21Z" />
      <circle cx="12" cy="14.88" r="1.92" />
      <line x1="7.21" y1="11.04" x2="9.13" y2="11.04" />
    </svg>
  );
}
