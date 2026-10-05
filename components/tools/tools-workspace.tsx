"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { toolCatalog } from "@/content/tools";
import { ToolsSettingsProvider, useToolCurrency } from "./tools-settings";

export function ToolsWorkspace({
  children,
  retirement,
  emergency,
  rentBuy,
}: {
  children: React.ReactNode;
  retirement: React.ReactNode;
  emergency: React.ReactNode;
  rentBuy: React.ReactNode;
}) {
  return (
    <ToolsSettingsProvider>
      <WorkspacePanels
        retirement={retirement}
        emergency={emergency}
        rentBuy={rentBuy}
      >
        {children}
      </WorkspacePanels>
    </ToolsSettingsProvider>
  );
}

function WorkspacePanels({
  children,
  retirement,
  emergency,
  rentBuy,
}: {
  children: React.ReactNode;
  retirement: React.ReactNode;
  emergency: React.ReactNode;
  rentBuy: React.ReactNode;
}) {
  const { currency, setCurrency } = useToolCurrency();
  const [active, setActive] = useState<string>("dca");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div className="tools-workspace">
      <aside className="tools-sidebar">
        <div className="tools-settings">
          <span className="eyebrow">CURRENCY / ALL TOOLS</span>
          <div className="tools-currency" role="group" aria-label="Currency">
            {(["DH", "USD"] as const).map((unit) => (
              <button
                key={unit}
                type="button"
                aria-pressed={currency === unit}
                onClick={() => setCurrency(unit)}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
        <div className="tools-sidebar-heading">
          <span className="eyebrow">
            <span className="cross">+</span> THE TOOLKIT
          </span>
          <p>
            Tools for
            <br />
            thinking ahead.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Financial tools"
          aria-orientation="vertical"
          className="tools-navigation"
        >
          {toolCatalog.map((tool, index) => (
            <button
              key={tool.id}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`tool-tab-${tool.id}`}
              aria-controls={`tool-panel-${tool.id}`}
              aria-selected={active === tool.id}
              tabIndex={active === tool.id ? 0 : -1}
              onClick={() => setActive(tool.id)}
              onKeyDown={(event) => {
                const keys = [
                  "ArrowDown",
                  "ArrowUp",
                  "ArrowLeft",
                  "ArrowRight",
                  "Home",
                  "End",
                ];
                if (!keys.includes(event.key)) return;
                event.preventDefault();
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? toolCatalog.length - 1
                      : (index +
                          (["ArrowDown", "ArrowRight"].includes(event.key)
                            ? 1
                            : -1) +
                          toolCatalog.length) %
                        toolCatalog.length;
                setActive(toolCatalog[next].id);
                tabs.current[next]?.focus();
              }}
            >
              <span className="tools-navigation-number">0{index + 1}</span>
              <span className="tools-navigation-label">{tool.title}</span>
              {active === tool.id && (
                <ArrowUpRight size={16} aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </aside>
      <div className="tools-content">
        <div
          role="tabpanel"
          id="tool-panel-dca"
          aria-labelledby="tool-tab-dca"
          hidden={active !== "dca"}
          tabIndex={0}
        >
          {children}
        </div>
        <div
          role="tabpanel"
          id="tool-panel-retirement"
          aria-labelledby="tool-tab-retirement"
          hidden={active !== "retirement"}
          tabIndex={0}
        >
          {retirement}
        </div>
        <div
          role="tabpanel"
          id="tool-panel-emergency"
          aria-labelledby="tool-tab-emergency"
          hidden={active !== "emergency"}
          tabIndex={0}
        >
          {emergency}
        </div>
        <div
          role="tabpanel"
          id="tool-panel-rent-buy"
          aria-labelledby="tool-tab-rent-buy"
          hidden={active !== "rent-buy"}
          tabIndex={0}
        >
          {rentBuy}
        </div>
      </div>
    </div>
  );
}
