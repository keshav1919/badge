import React from 'react';

export const MetaLogo = ({ size = 20, className = '' }) => {
  return (
    <svg
      width={size}
      height={size * (15 / 24)}
      viewBox="0 0 48 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-label="Meta"
    >
      <path
        d="M47.5 15C47.5 8.1 42.6 3 35.8 3C30.6 3 26.6 6.3 24 10.3C21.4 6.3 17.4 3 12.2 3C5.4 3 0.5 8.1 0.5 15C0.5 21.9 5.4 27 12.2 27C17.4 27 21.4 23.7 24 19.7C26.6 23.7 30.6 27 35.8 27C42.6 27 47.5 21.9 47.5 15ZM35.8 21.7C31.5 21.7 28.1 18.7 25.8 15C28.1 11.3 31.5 8.3 35.8 8.3C39.5 8.3 42.2 11.2 42.2 15C42.2 18.8 39.5 21.7 35.8 21.7ZM12.2 21.7C8.5 21.7 5.8 18.8 5.8 15C5.8 11.2 8.5 8.3 12.2 8.3C16.5 8.3 19.9 11.3 22.2 15C19.9 18.7 16.5 21.7 12.2 21.7Z"
        fill="#0064E0"
      />
    </svg>
  );
};

export default MetaLogo;
