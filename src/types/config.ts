export interface ThemeColors {
  accent: string;
  accentLight: string;
  accentPale: string;
  darkBg: string;
  darkBgAlt: string;
  lightBg: string;
  lightBgAlt: string;
}

export type Direction = "left" | "right";

export interface DesktopPhoto {
  src: string;
  x: string;
  y: string;
  zIndex: number;
  direction: Direction;
  label?: string;
}

export interface MobilePhoto {
  src: string;
}

export interface PortfolioConfig {
  meta: {
    name: string;
    headline: string;
    description: string;
    siteUrl: string;
    ogImage?: string;
  };

  themes: {
    black: ThemeColors;
    teal: ThemeColors;
    default: "black" | "teal";
  };

  nav: {
    links: Array<{
      label: string;
      href: string;
      external?: boolean;
      download?: string;
    }>;
  };

  hero: {
    desktopPhotos: DesktopPhoto[];
    mobilePhotos: MobilePhoto[];
  };

  sections: {
    synopsis?: SynopsisConfig;
    projects?: ProjectsConfig;
    skills?: SkillsConfig;
    courses?: CoursesConfig;
    contact?: ContactConfig;
  };

  features: {
    searchOverlay: boolean;
    scrollProgress: boolean;
    backToTop: boolean;
    githubHeatmap: boolean;
  };
}

export interface GlobeMarker {
  lat: number;
  lng: number;
  src: string;   // avatar image path (e.g. "/photos/photo-1.jpg")
  label: string; // tooltip / aria-label
}

export interface GlobeArc {
  from: [number, number];  // [lat, lng]—arc origin
  to: [number, number];    // [lat, lng]—arc destination
  color?: [number, number, number]; // RGB 0-1 (default uses arcColor)
  id?: string;             // CSS anchor id (anchors at arc midpoint)
  label?: string;          // label/tooltip shown at arc midpoint
  labelLat?: number;       // explicit label latitude (default: arc midpoint)
  labelLng?: number;       // explicit label longitude (default: arc midpoint)
}

export interface GlobeConfig {
  heading: string;
  markers?: GlobeMarker[];
  arcs?: GlobeArc[];
  atmosphereColor?: string;      // default: "#4da6ff"
  atmosphereIntensity?: number;  // default: 20
  autoRotateSpeed?: number;      // default: 0.3
  arcColor?: [number, number, number]; // default arc RGB color
  arcWidth?: number;              // line thickness (default: 0.5)
  arcHeight?: number;             // curve height above surface (default: 0.3)
}

export interface SynopsisConfig {
  enabled: boolean;
  heading: string;
  overline: string;
  body: string;
  links?: Array<{ label: string; href: string }>;
  github?: {
    username: string;
  };
  globe?: GlobeConfig;
}

export interface ProjectItem {
  title: string;
  description: string;
  repo?: string; // GitHub "owner/slug", e.g. "hoangngo-sudo/drincatuic"
  href?: string;
  tags?: string[];
}

export interface ProjectsConfig {
  enabled: boolean;
  heading: string;
  overline: string;
  viewAllUrl?: string;
  items: ProjectItem[];
}

export type StackDescriptionPart =
  | { type: "text"; content: string }
  | { type: "pill"; name: string; icon?: string; href?: string };

export interface SkillsConfig {
  enabled: boolean;
  heading: string;
  overline: string;
  stackDescription?: StackDescriptionPart[];
  categories: Array<{
    label: string;
    items: Array<{
      name: string;
      icon?: string;
      href?: string;
    }>;
  }>;
}

export interface CoursesConfig {
  enabled: boolean;
  heading: string;
  overline: string;
  categories: Array<{
    label: string;
    items: Array<{
      code: string;
      name: string;
      description?: string;
    }>;
  }>;
}

export interface ContactConfig {
  enabled: boolean;
  heading: string;
  overline: string;
  links: Array<{
    platform: string;
    label: string;
    href?: string;
    icon: string;
  }>;
}
