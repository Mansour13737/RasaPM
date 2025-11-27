import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M12.2 2.2a1 1 0 0 0-1.4 0l-8.5 8.5a1 1 0 0 0 0 1.4l5.4 5.4a1 1 0 0 0 1.4 0l8.5-8.5a1 1 0 0 0 0-1.4Z"/>
      <path d="M17.5 7.5 15 10l-2-2 2.5-2.5"/>
      <path d="m21.5 12.5-2-2"/>
      <path d="m14 22-2-2"/>
      <path d="M2 14 6 18"/>
      <path d="M15 22v-5l-4-4"/>
      <path d="M19 13V9a2 2 0 0 0-2-2H9.5"/>
      <path d="M14 6V5a2 2 0 0 0-2-2H8"/>
      <path d="M18 22V10"/>
      <path d="M22 22V8"/>
    </svg>
  );
}
