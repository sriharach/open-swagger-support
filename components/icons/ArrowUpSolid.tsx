import { SVGProps } from "react";

const ArrowUpSolid = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width={props.width || 24}
      height={props.height || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Up arrow"
    >
      <path d="M12 4l-6 6h4v8h4v-8h4l-6-6z" fill="currentColor" />
    </svg>
  );
};

export default ArrowUpSolid;
