import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(webRoot, "..", "..");
const publicDirectory = resolve(webRoot, "public");
const fallbackSiteUrl = "http://localhost:3000";
const publicRoutes = ["/login"];
const privateRoutes = ["/$", "/home", "/quizzes", "/create-quiz", "/editor", "/api"];

const siteUrl = trimTrailingSlash(
  process.env.VITE_SITE_URL ??
    (await readEnvValue("VITE_SITE_URL")) ??
    (await readEnvValue("FRONTEND_URL")) ??
    fallbackSiteUrl
);
const lastModified = new Date().toISOString();

await mkdir(publicDirectory, { recursive: true });
await writeFile(resolve(publicDirectory, "robots.txt"), createRobots(), "utf8");
await writeFile(resolve(publicDirectory, "sitemap.xml"), createSitemap(), "utf8");

function createRobots() {
  const disallowRules = privateRoutes.map((route) => `Disallow: ${route}`).join("\n");

  return `User-agent: *
Allow: /login
Allow: /favicon.svg
Allow: /og-image.svg
Allow: /site.webmanifest
${disallowRules}

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;
}

function createSitemap() {
  const urls = publicRoutes
    .map(
      (route) => `  <url>
    <loc>${absoluteUrl(route)}</loc>
    <lastmod>${lastModified}</lastmod>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function absoluteUrl(path) {
  return new URL(path, `${siteUrl}/`).toString();
}

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

async function readEnvValue(name) {
  const envFiles = [".env.local", ".env"];

  for (const envFile of envFiles) {
    const value = await readEnvFileValue(resolve(workspaceRoot, envFile), name);
    if (value) {
      return value;
    }
  }

  return undefined;
}

async function readEnvFileValue(path, name) {
  try {
    const content = await readFile(path, "utf8");
    const line = content
      .split(/\r?\n/)
      .map((entry) => entry.trim())
      .find((entry) => entry && !entry.startsWith("#") && entry.startsWith(`${name}=`));

    if (!line) {
      return undefined;
    }

    return line.slice(name.length + 1).replace(/^["']|["']$/g, "");
  } catch {
    return undefined;
  }
}
