import type { PortableTextBlock } from "emdash";

export interface TocHeading {
  id: string;
  level: number;
  text: string;
}

type HeadingBlock = PortableTextBlock & { headingId?: string };

function blockText(block: PortableTextBlock): string {
  return ((block.children as { text?: string }[] | undefined) ?? [])
    .map((child) => child.text ?? "")
    .join("");
}

/**
 * Gives each h1/h2 block a unique slug id. EmDash stores body headings one
 * level lower than they render (h1 -> h2, h2 -> h3), and only those two
 * rendered levels get anchors and appear in the table of contents.
 */
export function withHeadingIds(blocks: PortableTextBlock[]): HeadingBlock[] {
  const counts = new Map<string, number>();
  return blocks.map((block) => {
    if (block._type !== "block" || !/^h[1-2]$/.test(String(block.style))) return block;
    const base = blockText(block)
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    const count = (counts.get(base) ?? 0) + 1;
    counts.set(base, count);
    return { ...block, headingId: count > 1 ? `${base}-${count - 1}` : base };
  });
}

export function headingsToToc(blocks: PortableTextBlock[]): TocHeading[] {
  return withHeadingIds(blocks)
    .filter((block) => block.headingId)
    .map((block) => ({
      id: block.headingId as string,
      level: Number(String(block.style).slice(1)) + 1,
      text: blockText(block),
    }));
}
