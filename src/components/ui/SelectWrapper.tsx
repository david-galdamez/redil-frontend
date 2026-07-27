import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function SelectWrapper({ children, className = "" }: Props) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </div>
  );
}
