type FaIconProps = {
  name: string;
  className?: string;
  style?: React.CSSProperties;
};

/** A self-hosted Font Awesome Free icon. */
export default function FaIcon({ name, className = "", style }: FaIconProps) {
  return <i aria-hidden="true" className={`lu-fa fa-solid fa-${name} ${className}`} style={style} />;
}
