export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-heading">
      <p className="eyebrow">
        <span className="cross">+</span>
        {eyebrow}
      </p>
      <h1>
        {title.split("\n").map((line, i) => (
          <span key={line} className={i ? "muted-heading" : ""}>
            {line}
          </span>
        ))}
      </h1>
      <div className="page-heading-bottom">
        <p>{description}</p>
        {children}
      </div>
    </header>
  );
}
export function SectionHeading({
  number,
  label,
  title,
  children,
}: {
  number: string;
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">
        <span>{number}</span> / {label}
      </p>
      <div>
        <h2>
          {title.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        {children}
      </div>
    </div>
  );
}
