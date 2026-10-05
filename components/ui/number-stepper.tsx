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
  suffix,
  precision = 0,
  help,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  precision?: number;
  help?: React.ReactNode;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: precision,
  }).format(value);
  const rounded = (n: number) => Number(n.toFixed(precision));
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
              width: `${Math.max(1, (draft ?? formatted).length)}ch`,
              fontSize: value >= 1000000 ? 18 : undefined,
            }}
            inputMode={precision > 0 ? "decimal" : "numeric"}
            value={draft ?? formatted}
            onChange={(event) => {
              const raw =
                precision > 0
                  ? event.target.value
                      .replace(/[\s\u202f]/g, "")
                      .replace(",", ".")
                  : event.target.value.replace(/[\s\u202f,]/g, "");
              const pattern =
                precision > 0
                  ? new RegExp(
                      `^${min < 0 ? "-?" : ""}\\d*(\\.\\d{0,${precision}})?$`,
                    )
                  : /^\d*$/;
              if (!pattern.test(raw)) return;
              setDraft(raw);
              const parsed = Number(raw);
              if (
                raw &&
                Number.isFinite(parsed) &&
                parsed >= min &&
                parsed <= max
              )
                onChange(parsed);
            }}
            onBlur={() => {
              if (
                draft !== null &&
                draft !== "" &&
                Number.isFinite(Number(draft))
              )
                onChange(rounded(Math.max(min, Math.min(max, Number(draft)))));
              setDraft(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
          />
          {suffix && <span>{suffix}</span>}
        </div>
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => {
            setDraft(null);
            onChange(rounded(Math.max(min, value - step)));
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
            onChange(rounded(Math.min(max, value + step)));
          }}
        >
          <Plus size={17} />
        </button>
      </div>
    </div>
  );
}
