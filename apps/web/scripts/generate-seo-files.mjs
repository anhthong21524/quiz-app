import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(webRoot, "..", "..");
const publicDirectory = resolve(webRoot, "public");
const fallbackSiteUrl = "http://localhost:3000";
const publicRoutes = ["/login"];
const privateRoutes = [
  "/$",
  "/home",
  "/management",
  "/quizzes",
  "/profile",
  "/account",
  "/password",
  "/create-quiz",
  "/editor",
  "/api"
];

const siteUrl = trimTrailingSlash(
  process.env.VITE_SITE_URL ??
    (await readEnvValue("VITE_SITE_URL")) ??
    (await readEnvValue("FRONTEND_URL")) ??
    fallbackSiteUrl
);
const lastModified = new Date().toISOString();

await mkdir(publicDirectory, { recursive: true });

await Promise.all([
  generateOgImage(),
  generateIcons(),
  writeFile(resolve(publicDirectory, "robots.txt"), createRobots(), "utf8"),
  writeFile(resolve(publicDirectory, "sitemap.xml"), createSitemap(), "utf8")
]);

async function generateOgImage() {
  const svgBuffer = await readFile(resolve(publicDirectory, "og-image.svg"));
  await sharp(svgBuffer)
    .resize(1200, 630)
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(resolve(publicDirectory, "og-image.png"));
  console.log("Generated og-image.png");
}

async function generateIcons() {
  const svgBuffer = await readFile(resolve(publicDirectory, "favicon.svg"));

  await Promise.all([
    sharp(svgBuffer)
      .resize(180, 180)
      .png({ compressionLevel: 9 })
      .toFile(resolve(publicDirectory, "apple-touch-icon.png")),
    sharp(svgBuffer)
      .resize(192, 192)
      .png({ compressionLevel: 9 })
      .toFile(resolve(publicDirectory, "icon-192.png")),
    sharp(svgBuffer)
      .resize(512, 512)
      .png({ compressionLevel: 9 })
      .toFile(resolve(publicDirectory, "icon-512.png"))
  ]);
  console.log("Generated apple-touch-icon.png, icon-192.png, icon-512.png");
}

function createRobots() {
  const disallowRules = privateRoutes.map((route) => `Disallow: ${route}`).join("\n");

  return `User-agent: *
Allow: /login
Allow: /favicon.svg
Allow: /og-image.png
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
