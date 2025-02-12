import slugify from "slugify";

export function prepareMarkdown(content: string): string {
  // Keep track of heading occurrences for unique IDs
  const headingCounts = new Map<string, number>();

  // Process the content line by line
  const lines = content.split("\n");
  const processedLines = lines.map(line => {
    // Check if line is a heading
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (!headingMatch) return line;

    const [, hashes, text] = headingMatch;
    const level = hashes.length;

    // Skip h1 headers (remove them)
    if (level === 1) return "";

    // Only process h2 and h3
    if (level === 2 || level === 3) {
      // Check if the header already contains a markdown link
      const hasExistingLink = /\[.*\]\(.*\)/.test(text);
      if (hasExistingLink) return line;

      const baseId = slugify(text, {
        lower: true,
        strict: true,
        locale: "en",
        trim: true
      });

      // Increment count for this heading
      const count = (headingCounts.get(baseId) || 0) + 1;
      headingCounts.set(baseId, count);

      // Create unique ID with number suffix if needed
      const id = count > 1 ? `${baseId}-${count - 1}` : baseId;

      // Return the heading with markdown-style anchor link
      return `${hashes} [${text}](#${id})`;
    }

    return line;
  });

  // Join lines back together and return, preserving empty lines for markdown formatting
  return processedLines.join("\n");
}
