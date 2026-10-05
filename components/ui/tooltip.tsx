"use client";
import { useEffect, useId, useRef, useState } from "react";

/** Pointer hover, keyboard focus and touch have separate dismissal behavior. */
export function Tooltip({
  children,
  content,
}: {
  children: (descriptionId: string) => React.ReactNode;
  content: React.ReactNode;
}) {
  const id = useId();
  const anchor = useRef<HTMLDivElement>(null);
  const pointerFocus = useRef(false);
  const [mode, setMode] = useState<"hover" | "keyboard" | "touch" | null>(null);
  const [position, setPosition] = useState({ left: 0, width: 340 });
  function reveal(next: NonNullable<typeof mode>) {
    const bounds = anchor.current?.getBoundingClientRect();
    if (!bounds) return;
    const width = Math.min(340, window.innerWidth - 32);
    const left = Math.max(
      16,
      Math.min(
        window.innerWidth - width - 16,
        bounds.left + bounds.width / 2 - width / 2,
      ),
    );
    setPosition({ left: left - bounds.left, width });
    setMode(next);
  }
  useEffect(() => {
    if (!mode) return;
    function outside(event: PointerEvent) {
      if (!anchor.current?.contains(event.target as Node)) setMode(null);
    }
    const dismiss = () => setMode(null);
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", dismiss);
    window.addEventListener("scroll", dismiss, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("scroll", dismiss, true);
    };
  }, [mode]);
  return (
    <div
      className="ui-tooltip"
      ref={anchor}
      data-open={mode !== null}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") reveal("hover");
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch" && mode === "hover") setMode(null);
      }}
      onPointerDownCapture={(event) => {
        pointerFocus.current = true;
        if (event.pointerType === "touch") {
          if (mode === "touch") setMode(null);
          else reveal("touch");
        } else reveal("hover");
      }}
      onFocus={() => {
        if (!pointerFocus.current) reveal("keyboard");
      }}
      onBlur={() => {
        pointerFocus.current = false;
        setMode(null);
      }}
      onKeyDown={(event) => {
        pointerFocus.current = false;
        if (event.key === "Escape") {
          setMode(null);
          event.stopPropagation();
        } else if (event.key === " " || event.key === "Enter")
          reveal("keyboard");
      }}
    >
      {children(id)}
      <div
        className="ui-tooltip-content"
        id={id}
        role="tooltip"
        hidden={mode === null}
        style={position}
      >
        {content}
      </div>
    </div>
  );
}
