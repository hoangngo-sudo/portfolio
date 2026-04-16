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
    title: string;
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

export interface SynopsisConfig {
  enabled: boolean;
  heading: string;
  overline: string;
  body: string;
  links?: Array<{ label: string; href: string }>;
  github?: {
    username: string;
  };
}

export interface ProjectsConfig {
  enabled: boolean;
  heading: string;
  overline: string;
  viewAllUrl?: string;
  items: Array<{
    title: string;
    description: string;
    image?: string;
    href?: string;
    tags?: string[];
  }>;
}

export interface SkillsConfig {
  enabled: boolean;
  heading: string;
  overline: string;
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
    href: string;
    icon: string;
  }>;
}
