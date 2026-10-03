"use client";
import { useId, useState } from "react";

/** Decimal input: keeps intermediate typing local; commits only valid numbers. */
export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  help,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  help?: string;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const parsed = draft === null ? value : Number(draft);
  const valid =
    draft !== "" && Number.isFinite(parsed) && parsed >= min && parsed <= max;
  function normalize(number: number) {
    const clamped = Math.max(min, Math.min(max, number));
    return step === 1 ? Math.round(clamped) : clamped;
  }
  return (
    <div className="number-input">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={draft ?? value}
        aria-invalid={!valid || undefined}
        aria-describedby={help ? `${id}-help` : undefined}
        onChange={(event) => {
          const raw = event.target.value,
            next = Number(raw);
          setDraft(raw);
          if (raw !== "" && Number.isFinite(next) && next >= min && next <= max)
            onChange(normalize(next));
        }}
        onBlur={() => {
          if (draft !== null && draft !== "" && Number.isFinite(parsed))
            onChange(normalize(parsed));
          setDraft(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
      />
      {help && <small id={`${id}-help`}>{help}</small>}
    </div>
  );
}
