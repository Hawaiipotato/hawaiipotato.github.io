import fs from "node:fs";
import yaml from "js-yaml";
import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";

export function read(file: string) {
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing frontmatter: ${file}`);
  return {
    data: yaml.load(match[1], { schema: yaml.JSON_SCHEMA }) as Record<string, any>,
    body: match[2],
  };
}

export function parseDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  let text = String(value).trim().replace(" ", "T");
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) text += "T00:00:00";
  if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(text)) text += "+08:00";
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid content date: ${value}`);
  return date;
}

// Chinese characters and Latin word groups, excluding Markdown/HTML markup.
export function countWords(text: string): number {
  const plain = text
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  return (plain.match(/[\p{Script=Han}]|[\p{L}\p{N}_]+/gu) || []).length;
}

export const posts = fs.readdirSync("source/_posts")
  .filter(file => file.endsWith(".md"))
  .map(file => {
    const { data, body } = read(`source/_posts/${file}`);
    if (typeof data.title !== "string" || !data.date) throw new Error(`Missing title/date: ${file}`);
    for (const key of ["tags", "categories"]) {
      if (data[key] != null && (!Array.isArray(data[key]) || data[key].some((v: unknown) => typeof v !== "string"))) {
        throw new Error(`Expected a string list for ${key}: ${file}`);
      }
    }
    const slug = file.replace(/\.md$/, "");
    const words = countWords(body);
    return {
      ...data, body, slug, words,
      minutes: Math.max(1, Math.ceil(words / 300)),
      url: `/${data.categories?.[0] || "uncategorized"}/${slug}/`,
      date: parseDate(data.date),
      updated: data.updated ? parseDate(data.updated) : null,
    };
  })
  .sort((a, b) => b.date.getTime() - a.date.getTime());

export const dateLabel = (date: Date) => new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
}).format(date);

const renderer = createSatteriMarkdownProcessor({
  syntaxHighlight: "shiki", shikiConfig: { theme: "tokyo-night" },
});

export function cleanLegacyPage(body: string): string {
  return body
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<div class="skill-card contact-action" role="link" tabindex="0" data-href="([^"]+)">([\s\S]*?)<\/div>/g,
      "<a class=\"skill-card contact-action\" href=\"$1\">$2</a>");
}

export async function render(body: string) {
  return (await renderer).render(body);
}
