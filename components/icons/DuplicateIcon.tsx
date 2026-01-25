import { SVGProps } from "react";

const DuplicateIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || '24'}
      height={props.height || '24'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
    >
     
      <path d="M7 5h7.5L17 7.5V17a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />

      <path d="M11 9h7.5L21 11.5V21a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" />

      <polyline points="16.5 7.5 16.5 5 17 5.5" />
      <polyline points="20.5 11.5 20.5 9 21 9.5" />
    </svg>
  );
};

export default DuplicateIcon;
