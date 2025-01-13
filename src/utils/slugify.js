export function slugify(text) {
  // Replace '&' with 'and' before slugifying
  const textWithAnd = text.replace(/&/g, 'and');
  
  return textWithAnd
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
} 