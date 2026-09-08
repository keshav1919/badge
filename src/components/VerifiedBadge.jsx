import React from 'react';

/**
 * Pixel-accurate Instagram & Meta Verified Badge (8-point scalloped starburst + checkmark)
 */
export const VerifiedBadge = ({ size = 18, color = '#2e69ec', className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 align-middle select-none ${className}`}
      aria-label="Verified"
    >
      {/* 8-point scalloped Meta/Instagram verified burst */}
      <path
        d="M19.998 0.5C21.465 0.5 22.88 1.157 23.85 2.29L25.32 4.02C26.15 5 27.35 5.56 28.63 5.56H30.88C33.15 5.56 35 7.41 35 9.68V11.93C35 13.21 35.56 14.41 36.54 15.24L38.27 16.71C39.4 17.68 40.06 19.09 40.06 20.56C40.06 22.03 39.4 23.44 38.27 24.41L36.54 25.88C35.56 26.71 35 27.91 35 29.19V31.44C35 33.71 33.15 35.56 30.88 35.56H28.63C27.35 35.56 26.15 36.12 25.32 37.1L23.85 38.83C22.88 39.96 21.465 40.62 19.998 40.62C18.531 40.62 17.116 39.96 16.146 38.83L14.676 37.1C13.846 36.12 12.646 35.56 11.366 35.56H9.116C6.846 35.56 4.996 33.71 4.996 31.44V29.19C4.996 27.91 4.436 26.71 3.456 25.88L1.726 24.41C0.596 23.44 -0.064 22.03 -0.064 20.56C-0.064 19.09 0.596 17.68 1.726 16.71L3.456 15.24C4.436 14.41 4.996 13.21 4.996 11.93V9.68C4.996 7.41 6.846 5.56 9.116 5.56H11.366C12.646 5.56 13.846 5 14.676 4.02L16.146 2.29C17.116 1.157 18.531 0.5 19.998 0.5Z"
        fill={color}
      />
      {/* White center checkmark */}
      <path
        d="M17.48 27.28L10.72 20.52L13.12 18.12L17.48 22.48L27.68 12.28L30.08 14.68L17.48 27.28Z"
        fill="#FFFFFF"
      />
    </svg>
  );
};

export default VerifiedBadge;
