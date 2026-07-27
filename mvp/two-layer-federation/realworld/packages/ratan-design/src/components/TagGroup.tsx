export interface TagDefinition {
  readonly id: string;
  readonly label: string;
}

export interface TagGroupProps {
  readonly label: string;
  readonly tags: readonly TagDefinition[];
  readonly className?: string;
}

export function TagGroup({
  label,
  tags,
  className,
}: TagGroupProps) {
  return (
    <section
      className={['ratan-tag-group', className].filter(Boolean).join(' ')}
      data-ratan-component="tag-group"
      aria-label={label}
    >
      <span className="ratan-tag-group-label">{label}</span>
      <ul className="ratan-tag-list">
        {tags.map((tag) => <li className="ratan-tag" key={tag.id}>{tag.label}</li>)}
      </ul>
    </section>
  );
}
