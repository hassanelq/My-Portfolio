"use client";

import { useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Crosshair } from "lucide-react";
import { toolCatalog } from "@/content/tools";

export function ToolsWorkspace({
  children,
  retirement,
}: {
  children: React.ReactNode;
  retirement: React.ReactNode;
}) {
  const [active, setActive] = useState<string>("dca");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div className="tools-workspace">
      <aside className="tools-sidebar">
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
              <span className="tools-navigation-label">
                {tool.title}
                {tool.status === "coming-soon" && <small>Coming soon</small>}
              </span>
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
        {toolCatalog
          .filter((tool) => tool.status === "coming-soon")
          .map((tool) => (
            <div
              key={tool.id}
              role="tabpanel"
              id={`tool-panel-${tool.id}`}
              aria-labelledby={`tool-tab-${tool.id}`}
              hidden={active !== tool.id}
              tabIndex={0}
            >
              <section className="tool-coming-soon">
                <p className="eyebrow">THE TOOLKIT / COMING SOON</p>
                <h1>{tool.title}.</h1>
                <p className="tool-coming-description">{tool.description}</p>
                <div className="tool-coming-message">
                  <Crosshair size={40} strokeWidth={1} aria-hidden="true" />
                  <h2>Coming soon.</h2>
                  <p>
                    This tool is on the way. Explore monthly investing while it
                    takes shape.
                  </p>
                  <button
                    className="button"
                    onClick={() => {
                      setActive("dca");
                      tabs.current[0]?.focus();
                    }}
                  >
                    Open DCA simulator <ArrowRight size={18} />
                  </button>
                </div>
              </section>
            </div>
          ))}
      </div>
    </div>
  );
}
