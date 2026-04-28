import type { RouteLocationNormalizedLoaded } from "vue-router";
import { env } from "../config/env";
import { getOpenGraphLocale, t } from "../i18n";

type RobotsDirective = {
  index: boolean;
  follow: boolean;
};

type BreadcrumbItem = {
  name?: string;
  nameKey?: string;
  path: string;
};

export type SeoRouteMeta = {
  title?: string;
  titleKey?: string;
  description?: string;
  descriptionKey?: string;
  canonicalPath?: string;
  breadcrumbs?: BreadcrumbItem[];
  robots?: RobotsDirective;
};

declare module "vue-router" {
  interface RouteMeta {
    bareLayout?: boolean;
    requiresAuth?: boolean;
    seo?: SeoRouteMeta;
  }
}

const defaultImagePath = "/og-image.png";
const defaultImageWidth = "1200";
const defaultImageHeight = "630";
const defaultRobots: RobotsDirective = {
  index: true,
  follow: true
};
const privateRobots: RobotsDirective = {
  index: false,
  follow: false
};

export function applySeo(to: RouteLocationNormalizedLoaded) {
  const seo = to.meta.seo;
  const title = formatTitle(resolveText(seo?.title, seo?.titleKey));
  const description = resolveText(seo?.description, seo?.descriptionKey) ?? getDefaultDescription();
  const canonicalUrl = resolveUrl(seo?.canonicalPath ?? to.path);
  const imageUrl = resolveUrl(defaultImagePath);
  const robots = seo?.robots ?? (to.meta.requiresAuth ? privateRobots : defaultRobots);

  document.title = title;

  setMeta("description", description);
  setMeta("robots", formatRobots(robots));
  setMeta("googlebot", formatRobots(robots));

  setMetaProperty("og:site_name", getAppName());
  setMetaProperty("og:type", "website");
  setMetaProperty("og:title", title);
  setMetaProperty("og:description", description);
  setMetaProperty("og:url", canonicalUrl);
  setMetaProperty("og:image", imageUrl);
  setMetaProperty("og:image:width", defaultImageWidth);
  setMetaProperty("og:image:height", defaultImageHeight);
  setMetaProperty("og:locale", getOpenGraphLocale());

  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", title);
  setMeta("twitter:description", description);
  setMeta("twitter:image", imageUrl);

  setLink("canonical", canonicalUrl);
  setJsonLd(buildStructuredData(seo, canonicalUrl));
}

function formatTitle(title?: string) {
  const appName = getAppName();

  if (!title || title === appName) {
    return appName;
  }

  return `${title} | ${appName}`;
}

function formatRobots(robots: RobotsDirective) {
  return `${robots.index ? "index" : "noindex"}, ${robots.follow ? "follow" : "nofollow"}`;
}

function resolveText(value?: string, key?: string) {
  if (key) {
    return t(key);
  }

  return value;
}

function getAppName() {
  return t("common.appName");
}

function getDefaultDescription() {
  return t("seo.defaults.description");
}

function resolveUrl(path: string) {
  return new URL(path, `${env.siteUrl}/`).toString();
}

function setMeta(name: string, content: string) {
  setMetaElement("name", name, content);
}

function setMetaProperty(property: string, content: string) {
  setMetaElement("property", property, content);
}

function setMetaElement(attribute: "name" | "property", value: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${value}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.content = content;
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
}

function setJsonLd(value: Record<string, unknown>) {
  const scriptId = "app-structured-data";
  let element = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement("script");
    element.id = scriptId;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(value);
}

function buildStructuredData(seo: SeoRouteMeta | undefined, canonicalUrl: string) {
  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      name: formatTitle(resolveText(seo?.title, seo?.titleKey)),
      url: canonicalUrl,
      description: resolveText(seo?.description, seo?.descriptionKey) ?? getDefaultDescription(),
      isPartOf: {
        "@id": resolveUrl("/#website")
      }
    },
    {
      "@type": "WebSite",
      "@id": resolveUrl("/#website"),
      name: getAppName(),
      url: env.siteUrl,
      description: getDefaultDescription()
    },
    {
      "@type": "Organization",
      "@id": resolveUrl("/#organization"),
      name: getAppName(),
      url: env.siteUrl,
      logo: resolveUrl("/icon-512.png")
    },
    {
      "@type": "SoftwareApplication",
      "@id": resolveUrl("/#application"),
      name: getAppName(),
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: env.siteUrl,
      description: getDefaultDescription()
    }
  ];

  if (seo?.breadcrumbs?.length) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: seo.breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.nameKey ? t(item.nameKey) : item.name,
        item: resolveUrl(item.path)
      }))
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
