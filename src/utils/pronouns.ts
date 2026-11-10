/** The pronouns dropdown has a "Not specified" choice for when they aren't known; it is never shown. */
export function pronounsText(value: unknown): string {
  const pronouns = String(value ?? "").trim();
  return pronouns.toLowerCase() === "not specified" ? "" : pronouns;
}
