"use client";
import { useId, useState } from "react";
import katex from "katex";
export function Instrument({
  id,
  number,
  title,
  subtitle,
  footnote,
  children,
}: {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  footnote: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="instrument" aria-labelledby={`${id}-title`}>
      <div className="instrument-header">
        <h2 id={`${id}-title`}>
          <span className="mono">{number}</span>
          {title}
        </h2>
        <p>{subtitle}</p>
      </div>
      <div className="instrument-body">{children}</div>
      <p className="instrument-footnote">{footnote}</p>
    </section>
  );
}
export function NumberField({
  label,
  value,
  onChange,
  min = -1e9,
  max = 1e9,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const [draft, setDraft] = useState<string | null>(null),
    id = useId();
  const parsed = draft === null ? value : Number(draft),
    invalid =
      draft !== null &&
      (draft.trim() === "" ||
        !Number.isFinite(parsed) ||
        parsed < min ||
        parsed > max);
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={draft ?? value}
        aria-invalid={invalid || undefined}
        onChange={(event) => {
          const raw = event.target.value;
          setDraft(raw);
          const num = Number(raw);
          if (
            raw.trim() !== "" &&
            Number.isFinite(num) &&
            num >= min &&
            num <= max
          )
            onChange(num);
        }}
        onBlur={() => {
          if (draft !== null && draft.trim() !== "" && Number.isFinite(parsed))
            onChange(Math.min(max, Math.max(min, parsed)));
          setDraft(null);
        }}
      />
    </label>
  );
}
export function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <label className="field">
      <span className="range-label">
        <span>{label}</span>
        <span>
          {Number(value.toFixed(3))}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option value={o.value} key={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
export function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: React.ReactNode;
  note?: string;
}) {
  return (
    <div className="metric-block">
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}
export function Readouts({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <div className="readout-list">
      {items.map((item) => (
        <div className="readout-row" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}
export function Formula({ tex }: { tex: string }) {
  return (
    <div
      className="math-formula"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(tex, {
          throwOnError: false,
          trust: false,
          output: "htmlAndMathml",
        }),
      }}
    />
  );
}
export function Segmented({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
