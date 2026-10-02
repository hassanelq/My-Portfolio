"use client";
import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";

/** Compact editable number with accessible increment/decrement buttons. */
export function NumberStepper({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  help,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  help?: React.ReactNode;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div className="number-stepper">
      <div className="number-stepper-label">
        <label htmlFor={id}>{label}</label>
        {help}
      </div>
      <div className="number-stepper-controls">
        <div className="number-stepper-value">
          {prefix && <span>{prefix}</span>}
          <input
            id={id}
            type="text"
            style={{
              width: `${Math.max(1, (draft ?? new Intl.NumberFormat("fr-FR").format(value)).length)}ch`,
              fontSize: value >= 1000000 ? 18 : undefined,
            }}
            inputMode="numeric"
            value={draft ?? new Intl.NumberFormat("fr-FR").format(value)}
            onChange={(event) => {
              const raw = event.target.value.replace(/[\s\u202f,]/g, "");
              if (!/^\d*$/.test(raw)) return;
              setDraft(raw);
              const parsed = Number(raw);
              if (
                raw &&
                Number.isSafeInteger(parsed) &&
                parsed >= min &&
                parsed <= max
              )
                onChange(parsed);
            }}
            onBlur={() => {
              if (draft !== null && draft !== "")
                onChange(Math.max(min, Math.min(max, Number(draft))));
              setDraft(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
          />
        </div>
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => {
            setDraft(null);
            onChange(Math.max(min, value - step));
          }}
        >
          <Minus size={17} />
        </button>
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => {
            setDraft(null);
            onChange(Math.min(max, value + step));
          }}
        >
          <Plus size={17} />
        </button>
      </div>
    </div>
  );
}
