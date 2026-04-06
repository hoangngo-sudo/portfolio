import Fuse from "fuse.js";
import config from "@/config/portfolio.config";

export interface SearchItem {
  title: string;
  description?: string;
  section: string;
  sectionId: string;
  href?: string;
}

function collectSearchItems(): SearchItem[] {
  const items: SearchItem[] = [];
  const { sections } = config;

  if (sections.projects?.enabled) {
    for (const p of sections.projects.items) {
      items.push({
        title: p.title,
        description: [p.description, ...(p.tags ?? [])].join(" "),
        section: "Projects",
        sectionId: "projects",
        href: p.href,
      });
    }
  }

  if (sections.skills?.enabled) {
    for (const cat of sections.skills.categories) {
      for (const s of cat.items) {
        items.push({
          title: s.name,
          description: cat.label,
          section: "Skills",
          sectionId: `skill-${s.name.toLowerCase().replace(/[\s.]+/g, "-")}`,
          href: s.href,
        });
      }
    }
  }

  if (sections.courses?.enabled) {
    for (const cat of sections.courses.categories) {
      for (const c of cat.items) {
        items.push({
          title: `${c.code} · ${c.name}`,
          description: c.description,
          section: "Courses",
          sectionId: "courses",
        });
      }
    }
  }

  if (sections.contact?.enabled) {
    for (const c of sections.contact.links) {
      items.push({
        title: c.label,
        description: c.platform,
        section: "Contact",
        sectionId: "contact",
        href: c.href,
      });
    }
  }

  return items;
}

let fuseInstance: Fuse<SearchItem> | null = null;

export function getSearchIndex(): Fuse<SearchItem> {
  if (!fuseInstance) {
    const items = collectSearchItems();
    fuseInstance = new Fuse(items, {
      keys: ["title", "description"],
      threshold: 0.3,
      includeScore: true,
    });
  }
  return fuseInstance;
}
