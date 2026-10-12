import { useEffect } from "react";
import { SITE_URL } from "../config/site";

interface MetaKey {
  property?: string;
  name?: string;
}

const META_KEYS: MetaKey[] = [
  { property: "og:title" },
  { property: "og:description" },
  { property: "og:url" },
  { name: "description" },
  { name: "twitter:title" },
  { name: "twitter:description" },
];

function selectorFor(key: MetaKey): string {
  return key.property
    ? `meta[property="${key.property}"]`
    : `meta[name="${key.name}"]`;
}

interface MetaSnapshot {
  element: HTMLMetaElement;
  createdByThisEffect: boolean;
  previousContent: string | null;
}

export default function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;

    const canonicalUrl: string | undefined = SITE_URL
      ? `${SITE_URL}${window.location.pathname}`
      : undefined;

    const values: Record<string, string | undefined> = {
      "og:title": title || undefined,
      "og:description": description,
      "og:url": canonicalUrl,
      description,
      "twitter:title": title || undefined,
      "twitter:description": description,
    };

    const snapshots: MetaSnapshot[] = [];

    for (const key of META_KEYS) {
      const value = values[key.property ?? key.name ?? ""];
      if (value === undefined) {
        continue;
      }

      const selector = selectorFor(key);
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      const createdByThisEffect = element === null;

      if (!element) {
        element = document.createElement("meta");
        if (key.property) {
          element.setAttribute("property", key.property);
        }
        if (key.name) {
          element.setAttribute("name", key.name);
        }
        document.head.appendChild(element);
      }

      snapshots.push({
        element,
        createdByThisEffect,
        previousContent: createdByThisEffect
          ? null
          : element.getAttribute("content"),
      });

      element.setAttribute("content", value);
    }

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    let canonicalSnapshot: {
      element: HTMLLinkElement;
      createdByThisEffect: boolean;
      previousHref: string | null;
    } | null = null;

    if (canonicalUrl) {
      const createdByThisEffect = canonical === null;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonicalSnapshot = {
        element: canonical,
        createdByThisEffect,
        previousHref: createdByThisEffect ? null : canonical.getAttribute("href"),
      };
      canonical.setAttribute("href", canonicalUrl);
    }

    if (title) {
      document.title = title;
    }

    return () => {
      document.title = previousTitle;

      for (const snapshot of snapshots) {
        if (snapshot.createdByThisEffect) {
          snapshot.element.remove();
        } else if (snapshot.previousContent === null) {
          snapshot.element.removeAttribute("content");
        } else {
          snapshot.element.setAttribute("content", snapshot.previousContent);
        }
      }

      if (canonicalSnapshot) {
        if (canonicalSnapshot.createdByThisEffect) {
          canonicalSnapshot.element.remove();
        } else if (canonicalSnapshot.previousHref === null) {
          canonicalSnapshot.element.removeAttribute("href");
        } else {
          canonicalSnapshot.element.setAttribute("href", canonicalSnapshot.previousHref);
        }
      }
    };
  }, [title, description]);
}
