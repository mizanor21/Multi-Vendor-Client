import React from "react";

export default function TkIcon({ size, color }) {
  return (
    <div>
      <svg
        fill={color}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        id="taka-2"
        data-name="Flat Line"
        xmlns="http://www.w3.org/2000/svg"
        className="icon flat-line"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            id="primary"
            d="M6,3H6A3,3,0,0,1,9,6V16.5A4.49,4.49,0,0,0,13.5,21h0A4.49,4.49,0,0,0,18,16.5V12"
            style={{
              fill: "none",
              stroke: color,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "1.224",
            }}
          ></path>
          <line
            id="primary-2"
            data-name="primary"
            x1="6"
            y1="11"
            x2="12"
            y2="11"
            style={{
              fill: "none",
              stroke: color,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "1.224",
            }}
          ></line>
        </g>
      </svg>
    </div>
  );
}
