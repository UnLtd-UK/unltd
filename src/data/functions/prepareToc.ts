export function prepareToc(body: string) {
  const toc = [];
  const regex = /^(##|###) (.+)$/gm;
  let match;

  while ((match = regex.exec(body)) !== null) {
    const text = match[2].replace(/\[|\]|\(.*?\)/g, '').trim();
    const idMatch = match[2].match(/\(#(.*?)\)/);
    const id = idMatch ? idMatch[1] : text.toLowerCase().replace(/\s+/g, '-');
    toc.push({
      id: id,
      level: match[1] === '##' ? 2 : 3,
      text: text,
    });
  }

  return toc;
}
