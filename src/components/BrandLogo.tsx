interface BrandLogoProps {
  /** Logo height in pixels. Width scales automatically. Default 26. */
  height?: number;
  /** Wrap the logo in a white rounded chip so the charcoal wordmark stays
   *  legible on dark backgrounds (sidebar, login). Default false. */
  chip?: boolean;
  className?: string;
}

/**
 * Official CommonSpirit logo (sourced from commonspirit.careers, bundled at
 * /commonspirit-logo.png). The preferred mark uses a charcoal wordmark, so on
 * dark surfaces render it inside a white chip via `chip`.
 */
export default function BrandLogo({ height = 26, chip = false, className = "" }: BrandLogoProps) {
  const img = (
    <img
      src="/commonspirit-logo.png"
      alt="CommonSpirit"
      style={{ height }}
      className="w-auto select-none"
      draggable={false}
    />
  );

  if (chip) {
    return (
      <span
        className={`inline-flex items-center rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5 ${className}`}
      >
        {img}
      </span>
    );
  }

  return <span className={`inline-flex items-center ${className}`}>{img}</span>;
}
