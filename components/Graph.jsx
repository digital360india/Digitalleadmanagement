import React from "react";

const DynamicCircularGraph = ({ value, labels, index }) => {
  const circleRadius = 50;
  const circumference = 2 * Math.PI * circleRadius;
  const textColors = ["#2D77AF", "#2D77AF", "#2D77AF", "#2D77AF"];

  return (
    <>
      {value.map((val, i) => {
        const strokeDashoffset = circumference * (1 - val / 100);
        const textColor = textColors[i % textColors.length];

        return (
          <div
            className="flex relative flex-col items-center justify-center space-y-2"
            key={i}
          >
            <svg
              className="w-24 h-24"
              width="120"
              height="120"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r={circleRadius}
                fill="transparent"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r={circleRadius}
                fill="transparent"
                stroke={textColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                className="transition-all duration-500"
              />
            </svg>
            <span
              className="absolute inset-0 top-6 left-8 text-xl font-semibold"
              style={{ color: textColor }}
            >
              {val}%
            </span>
            <div className="text-center">
              <p className="text-sm">{labels[i]}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default DynamicCircularGraph;
