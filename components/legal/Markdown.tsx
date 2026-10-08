import { Fragment, type ReactNode } from "react";

/**
 * Minimal, dependency-free Markdown renderer for legal documents. Supports
 * exactly what those documents use: `#`/`##`/`###` headings, blank-line
 * separated paragraphs (hard wraps are joined into one flow), `- ` bullet
 * lists, and inline `**bold**`. Colours + sizing come from `.legal-prose` (globals.css).
 */
function inline(text: string, keyBase: string): ReactNode[] {
  // Odd segments of the split are the bolded runs.
  return text.split(/\*\*(.+?)\*\*/g).map((seg, i) =>
    i % 2 === 1 ? (
      <strong key={`${keyBase}-b${i}`}>{seg}</strong>
    ) : (
      <Fragment key={`${keyBase}-t${i}`}>{seg}</Fragment>
    ),
  );
}

export default function Markdown({ source }: { source: string }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <>
      {blocks.map((raw, i) => {
        const block = raw.trim();
        if (!block) return null;
        if (block.startsWith("### "))
          return <h3 key={i}>{inline(block.slice(4), `h3-${i}`)}</h3>;
        if (block.startsWith("## "))
          return <h2 key={i}>{inline(block.slice(3), `h2-${i}`)}</h2>;
        if (block.startsWith("# "))
          return <h1 key={i}>{inline(block.slice(2), `h1-${i}`)}</h1>;
        if (block.startsWith("- ")) {
          // A list: each "- " starts an item; wrapped lines join the item above.
          const items: string[] = [];
          for (const line of block.split("\n")) {
            if (line.startsWith("- ")) items.push(line.slice(2).trim());
            else items[items.length - 1] += ` ${line.trim()}`;
          }
          return (
            <ul key={i}>
              {items.map((item, j) => (
                <li key={j}>{inline(item, `li-${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{inline(block.replace(/\n/g, " "), `p-${i}`)}</p>;
      })}
    </>
  );
}
