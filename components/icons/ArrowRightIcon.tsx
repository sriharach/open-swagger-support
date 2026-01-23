import { SVGProps } from "react";

const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={props.width || "24"}
      height={props.height || "24"}
    >
      <circle
        cx="64"
        cy="64"
        r="57.6"
        stroke="currentColor"
        strokeWidth="6.4"
        fill="none"
      />
      <path
        fill="currentColor"
        d="M49.2,38.4L73.6,64L49.2,89.6h13.5L86.4,64L62.7,38.4H49.2z"
      />
    </svg>
  );
};

export default ArrowRightIcon;
