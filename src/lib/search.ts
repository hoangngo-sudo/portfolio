import Fuse from "fuse.js";
import config from "@/config/portfolio.config";

export interface SearchItem {
  title: string;
  description?: string;
  searchText?: string; // extra text indexed by Fuse but not displayed
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
        description: p.description,
        searchText: (p.tags ?? []).join(" "),
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
          sectionId: "skills",
          href: s.href,
        });
      }
    }
  }

  if (sections.courses?.enabled) {
    for (const cat of sections.courses.categories) {
      for (const c of cat.items) {
        items.push({
          title: `${c.code}: ${c.name}`,
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

// Maps common query aliases to the canonical section label
const SECTION_ALIASES: Record<string, string> = {
  projects: "Projects",
  project: "Projects",
  skills: "Skills",
  skill: "Skills",
  courses: "Courses",
  course: "Courses",
  contact: "Contact",
  contacts: "Contact",
};

let fuseInstance: Fuse<SearchItem> | null = null;
let allItems: SearchItem[] | null = null;

function getSearchIndex(): Fuse<SearchItem> {
  if (!fuseInstance) {
    allItems = collectSearchItems();
    fuseInstance = new Fuse(allItems, {
      keys: ["title", "description", "searchText"],
      threshold: 0.3,
      includeScore: true,
    });
  }
  return fuseInstance;
}

export function searchItems(query: string): SearchItem[] {
  const fuse = getSearchIndex();
  const normalized = query.trim().toLowerCase();

  const sectionLabel = SECTION_ALIASES[normalized];
  if (sectionLabel) {
    return (allItems ?? []).filter((item) => item.section === sectionLabel);
  }

  return fuse.search(query, { limit: 20 }).map((r) => r.item);
}
