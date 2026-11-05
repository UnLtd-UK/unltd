import type { PostAuthor } from "@data/posts";

const LONDON = "Europe/London";

/** "Thu, 22 Oct 2026, 11:00" in UK time, whatever timezone the build runs in. */
export function formatPostDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    timeZone: LONDON,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** The calendar year of a post in UK time, so a post at 00:30 on 1 Jan BST isn't put in the previous year. */
export function postYear(date: string): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: LONDON, year: "numeric" }).format(new Date(date)),
  );
}

/** "22 Oct 2026" in UK time. */
export function formatShortDate(date: string): string {
  const instant = new Date(date);
  const day = new Intl.DateTimeFormat("en-GB", { timeZone: LONDON, day: "2-digit" }).format(instant);
  // en-US keeps "Sep" where en-GB gives "Sept".
  const month = new Intl.DateTimeFormat("en-US", { timeZone: LONDON, month: "short" }).format(instant);
  return `${day} ${month} ${postYear(date)}`;
}

/** "Name, Job title" for each author, or an empty string when the post has no byline. */
export function formatAuthors(authors: PostAuthor[]): string {
  return authors
    .map((author) => (author.jobTitle ? `${author.name}, ${author.jobTitle}` : author.name))
    .join("; ");
}
