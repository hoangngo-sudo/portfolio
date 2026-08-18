import type { PortfolioConfig } from "@/types/config";

const config: PortfolioConfig = {
  meta: {
    name: "Hoang Ngo",
    headline: "Xin chào, I am Hoang",
    description: "I am an aspiring web developer who enjoys building websites.",
    siteUrl: "https://hoaangngo.com",
    ogImage: "/og.png",
  },

  themes: {
    black: {
      accent: "oklch(0.767 0 0)",
      accentLight: "oklch(0.87 0 0)",
      accentPale: "oklch(0.958 0 0)",
      link: "oklch(0.439 0 0)",
      darkBg: "oklch(0.178 0 0)",
      darkBgAlt: "oklch(0.256 0 0)",
      lightBg: "oklch(1 0 0)",
      lightBgAlt: "oklch(0.979 0 0)",
    },
    teal: {
      accent: "oklch(0.6 0.104 184.7)",
      accentLight: "oklch(0.704 0.123 182.5)",
      accentPale: "oklch(0.984 0.014 180.7)",
      link: "oklch(0.511 0.086 186.4)",
      darkBg: "oklch(0.207 0.016 196)",
      darkBgAlt: "oklch(0.241 0.017 196.1)",
      lightBg: "oklch(0.99 0.006 170.5)",
      lightBgAlt: "oklch(0.971 0.008 186.9)",
    },
    default: "teal",
  },

  nav: {
    links: [
      { label: "Resume", href: "/resume" },
      { label: "About Me", href: "#synopsis" },
      { label: "Projects", href: "#projects" },
      { label: "Skills", href: "#skills" },
      { label: "Contact", href: "#contact" },
    ],
  },

  hero: {
    desktopPhotos: [
      { src: "/photos/photo-1.jpg", x: "-320px", y: "15px", zIndex: 50, direction: "left", label: "Taken in Frankfurt, Germany 🌍" },
      { src: "/photos/photo-2.jpg", x: "-160px", y: "32px", zIndex: 40, direction: "left", label: "Taken at Evanston High School 😃" },
      { src: "/photos/photo-3.jpg", x: "0px", y: "8px", zIndex: 30, direction: "right", label: "Taken at the McCormick Place 😄" },
      { src: "/photos/photo-4.jpg", x: "160px", y: "22px", zIndex: 20, direction: "right", label: "Taken at Loyola University 😎" },
      { src: "/photos/photo-5.jpg", x: "320px", y: "44px", zIndex: 10, direction: "left", label: "Taken at Starved Rock State Park 😍" },
    ],
    mobilePhotos: [
      { src: "/photos/photo-1.jpg" },
      { src: "/photos/photo-2.jpg" },
      { src: "/photos/photo-3.jpg" },
      { src: "/photos/photo-4.jpg" },
      { src: "/photos/photo-5.jpg" },
    ],
  },

  sections: {
    synopsis: {
      enabled: true,
      overline: "b. 2003",
      heading: "About me",
      body: "I am Hoang Ngo. I grew up in Ho Chi Minh City, Vietnam. I now study Computer Science at the University of Illinois Chicago. I chose Computer Science because I like programming languages and I want to build web applications. I spend most of my time on web development. I care about how things feel. A good interface feels like second nature. You do not have to think about what to click next. I also care about the backend. A website that looks good but breaks during use is not useful. Outside code, I read and study the Bible daily to learn more about Jesus, my savior. My faith in God keeps me grounded in my work.",
      github: {
        username: "hoangngo-sudo",
      },
      globe: {
        heading: "From HCMC to Chicago",
        markers: [
          { lat: 10.8231, lng: 106.6297, src: "/photos/photo-1.jpg", label: "Ho Chi Minh City, Vietnam" },
          { lat: 41.8781, lng: -87.6298, src: "/photos/photo-1.jpg", label: "Chicago, Illinois" },
        ],
        arcs: [
          {
            from: [10.8231, 106.6297],
            to: [41.8781, -87.6298],
            id: "hcmc-chicago",
            label: "12,789 km",
            labelLat: 45,
            labelLng: 175,
          },
        ],
        atmosphereColor: "oklch(0.6 0.104 184.7)",
        atmosphereIntensity: 15,
        autoRotateSpeed: 0.3,

        arcWidth: 0.5,
        arcHeight: 0.5,
      },
    },

    projects: {
      enabled: true,
      overline: "",
      heading: "Featured Projects",
      viewAllUrl: "https://github.com/hoangngo-sudo",
      items: [
        {
          title: "portfolio",
            description: "A config-driven developer portfolio built with Next.js 16, Base UI, Tailwind CSS v4, and Motion.",
          repo: "hoangngo-sudo/portfolio",
          tags: ["TypeScript", "Next.js", "BaseUI", "TailwindCSS", "Motion"],
          href: "https://github.com/hoangngo-sudo/portfolio",
        },
        {
          title: "drincatuic",
            description: "Student retreat event page.",
          repo: "hoangngo-sudo/drincatuic",
          tags: ["HTML", "CSS", "Javascript", "Webpack", "Supabase", "GSAP"],
          href: "https://github.com/hoangngo-sudo/drincatuic",
        },
        {
          title: "purpleit",
            description: "A Reddit inspired web application that empowers users to create posts, browse through a dynamic feed, leave comments, and upvote posts.",
          repo: "hoangngo-sudo/purpleit",
          tags: ["React", "Vite", "Javascript", "Supabase", "Bootstrap", "Motion"],
          href: "https://github.com/hoangngo-sudo/purpleit",
        },
        {
          title: "the-morytale",
            description: "Narrative storytelling in an interactive application.",
          repo: "hoangngo-sudo/the-morytale",
          tags: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Python"],
          href: "https://github.com/hoangngo-sudo/the-morytale",
        }
      ],
    },

    skills: {
      enabled: true,
      overline: "",
      heading: "Skills",
      stackDescription: [
        { type: "text", content: "My main stack is " },
        { type: "pill", name: "React", icon: "react", href: "https://react.dev" },
        { type: "text", content: " and " },
        { type: "pill", name: "Next.js", icon: "nextjs", href: "https://nextjs.org" },
        { type: "text", content: " for building full-stack website, with " },
        { type: "pill", name: "JavaScript", icon: "javascript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
        { type: "text", content: " as my language. Everything is version-controlled with " },
        { type: "pill", name: "Git", icon: "git", href: "https://git-scm.com" },
        { type: "text", content: " and deployed through " },
        { type: "pill", name: "GitHub", icon: "github", href: "https://github.com" },
        { type: "text", content: ". " },
        { type: "text", content: "For database management, I use " },
        { type: "pill", name: "Supabase", icon: "supabase", href: "https://supabase.com" },
        { type: "text", content: " (I am still learning the backend, so for now I use Supabase for data). Last but not least, I use " },
        { type: "pill", name: "VSCode", icon: "vscode", href: "https://code.visualstudio.com" },
        { type: "text", content: " IDE with help from AI agents to create awesome projects." },
      ],
      categories: [
        {
          label: "Language",
          items: [
            { name: "Python", icon: "python", href: "https://www.python.org" },
            { name: "C/C++", icon: "cpp", href: "https://isocpp.org" },
            { name: "Java", icon: "java", href: "https://dev.java" },
            { name: "HTML", icon: "html", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
            { name: "CSS", icon: "css", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
            { name: "JavaScript", icon: "javascript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
            { name: "SQLite", icon: "sqlite", href: "https://www.sqlite.org" },
            { name: "Bash", icon: "bash", href: "https://www.gnu.org/software/bash" },
          ],
        },
        {
          label: "Frontend",
          items: [
            { name: "TailwindCSS", icon: "tailwindcss", href: "https://tailwindcss.com" },
            { name: "Motion", icon: "motion", href: "https://motion.dev" },
            { name: "BaseUI", icon: "baseui", href: "https://base-ui.com" },
          ],
        },
        {
          label: "Framework",
          items: [
            { name: "React", icon: "react", href: "https://react.dev" },
            { name: "Node.js", icon: "nodejs", href: "https://nodejs.org" },
            { name: "p5.js", icon: "p5js", href: "https://p5js.org" },
            { name: "Next.js", icon: "nextjs", href: "https://nextjs.org" },
          ],
        },
        {
          label: "Tool",
          items: [
            { name: "Git", icon: "git", href: "https://git-scm.com" },
            { name: "GitHub", icon: "github", href: "https://github.com" },
            { name: "Linux", icon: "linux", href: "https://www.linux.org" },
            { name: "Docker", icon: "docker", href: "https://www.docker.com" },
            { name: "VSCode", icon: "vscode", href: "https://code.visualstudio.com" },
            { name: "IntelliJ", icon: "intellij", href: "https://www.jetbrains.com/idea" },
            { name: "Figma", icon: "figma", href: "https://www.figma.com" }
          ],
        },
      ],
    },

    courses: {
      enabled: true,
      overline: "",
      heading: "CS courses that I took and will be taking",
      categories: [
        {
          label: "",
          items: [
            { code: "CS111", name: "Program Design I", description: "Introduction to programming concepts using Python" },
            { code: "CS LEV 1", name: "Python Data Structures", description: "Fundamental data structures implemented in Python" },
            { code: "CS141", name: "Program Design II", description: "Object-oriented programming and advanced design in C++" },
            { code: "ENGR101", name: "Engineering Orientation for Transfers", description: "Overview of engineering disciplines for transfer students" },
            { code: "CS211", name: "Programming Practicum", description: "Hands-on coding practice and debugging techniques in C" },
            { code: "CS251", name: "Data Structures", description: "Trees, graphs, hash tables, and algorithm analysis in C++" },
            { code: "CS261", name: "Machine Organization", description: "Assembly language, memory hierarchy, and CPU architecture" },
            { code: "CS277", name: "Technical Communication in Comp Sci", description: "Writing and presenting technical content for CS audiences" },
            { code: "CS301", name: "Languages and Automata", description: "Formal languages, finite automata, and computability theory" },
            { code: "CS341", name: "Programming Language Concepts", description: "Paradigms, type systems, and language design principles" },
            { code: "CS342", name: "Software Design", description: "Design patterns, architecture, and software engineering practices in Java" },
            { code: "CS377", name: "Ethical Issues in Computing", description: "Privacy, security, AI ethics, and ACM professional conduct" },
            { code: "CS361", name: "System Computing", description: "Operating systems, processes, threads, and synchronization" },
            { code: "CS362", name: "Computer Design", description: "Digital logic, processor design, and hardware organization" },
            { code: "CS401", name: "Computer Algorithms I", description: "Algorithm design, complexity analysis, and NP-completeness" },
            { code: "CS441", name: "Engineering Distributed Objects For Cloud Computing", description: "Cloud architectures, distributed systems, and microservices" },
            { code: "CS421", name: "Natural Language Processing", description: "Text processing, language models, and NLP pipelines" },
            { code: "CS422", name: "User Interface Design and Programming", description: "UI/UX principles, prototyping, and interactive systems" },
            { code: "CS480", name: "Database Systems", description: "Relational models, SQL, query optimization, and transactions" }
          ],
        },
      ],
    },

    contact: {
      enabled: true,
      overline: "",
      heading: "Online",
      links: [
        {
          platform: "email",
          label: "work@hoaangngo.com",
          icon: "email",
        },
        {
          platform: "linkedin",
          label: "/in/hoang-minh-ngo/",
          href: "https://www.linkedin.com/in/hoang-minh-ngo/",
          icon: "linkedin",
        },
        {
          platform: "github",
          label: "/hoangngo-sudo",
          href: "https://github.com/hoangngo-sudo",
          icon: "github",
        },
        {
          platform: "instagram",
          label: "@hoaang.ngo",
          href: "https://www.instagram.com/hoaang.ngo/",
          icon: "instagram",
        },
      ],
    },
  },

  features: {
    searchOverlay: true,
    scrollProgress: true,
    backToTop: true,
    githubHeatmap: true,
  },
};

export default config;
