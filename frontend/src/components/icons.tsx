import type { SVGProps } from "react";

// Ionicons rendered as inline SVG with stroke="currentColor" to follow text color (hover, dark mode).

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 32,
};

export function TrashIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path
        d="m112 112 20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M80 112h352" strokeLinecap="round" strokeMiterlimit="10" />
      <path
        d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40M256 176v224M184 176l8 224M328 176l-8 224"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path
        d="M364.13 125.25 87 403l-23 45 44.99-23 277.76-277.13zM420.69 68.69l-22.62 22.62 22.62 22.63 22.62-22.63a16 16 0 0 0 0-22.62h0a16 16 0 0 0-22.62 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
