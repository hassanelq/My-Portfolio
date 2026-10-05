import katex from "katex";

/** Render a code-defined equation with visual and MathML output. */
export function MathFormula({ tex }: { tex: string }) {
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
