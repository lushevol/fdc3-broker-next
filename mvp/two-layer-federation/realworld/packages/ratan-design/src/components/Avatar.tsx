export interface AvatarProps {
  readonly name: string;
  readonly src?: string;
  readonly size?: 'small' | 'medium' | 'large';
  readonly className?: string;
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function Avatar({
  name,
  src,
  size = 'medium',
  className,
}: AvatarProps) {
  return (
    <span
      className={['ratan-avatar', className].filter(Boolean).join(' ')}
      data-ratan-component="avatar"
      data-ratan-size={size}
      aria-label={name}
      role="img"
    >
      {src ? <img src={src} alt="" /> : <span aria-hidden="true">{initials(name)}</span>}
    </span>
  );
}
