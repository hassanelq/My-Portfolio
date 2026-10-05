"use client";

import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { Tooltip } from "./tooltip";
import { Dialog } from "./dialog";

/** Brief hover/focus help, with a readable dialog on click or tap. */
export function ParameterHelp({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip content={children}>
        {(id) => (
          <button
            type="button"
            className="savings-help"
            aria-label={`About ${label.toLowerCase()}`}
            aria-describedby={id}
            onClick={() => setOpen(true)}
          >
            <CircleHelp size={16} aria-hidden="true" />
          </button>
        )}
      </Tooltip>
      {open && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title={label}
          size="compact"
          footer={<button onClick={() => setOpen(false)}>Got it</button>}
        >
          <p>{children}</p>
        </Dialog>
      )}
    </>
  );
}
