import type { PortfolioConfig } from "@/types/config";

const config: PortfolioConfig = {
  meta: {
    name: "Hoang Minh Ngo",
    title: "Chicago, Illinois",
    headline: "Hey, I am Hoang",
    description: "",
    ogImage: "/og.png",
  },

  themes: {
    black: {
      accent: "#7c8594",
      accentLight: "#9ba3b0",
      accentPale: "#f0f2f5",
      darkBg: "#0d0d11",
      darkBgAlt: "#191920",
      lightBg: "#ffffff",
      lightBgAlt: "#f7f8fa",
    },
    teal: {
      accent: "#0d9488",
      accentLight: "#14b8a6",
      accentPale: "#f0fdfa",
      darkBg: "#0f1a1a",
      darkBgAlt: "#162222",
      lightBg: "#f8fdfb",
      lightBgAlt: "#f0f7f6",
    },
    default: "teal",
  },

  nav: {
    links: [
      { label: "Resume", href: "/resume.pdf", external: true, download: "Hoang_Minh_Ngo_Resume.pdf" },
      { label: "About Me", href: "#synopsis" },
      { label: "Projects", href: "#projects" },
      { label: "Skills", href: "#skills" },
      { label: "Contact", href: "#contact" },
    ],
  },

  hero: {
    desktopPhotos: [
      { src: "/photos/photo-1.jpg", x: "-320px", y: "15px", zIndex: 50, direction: "left", label: "Photo of me 😀" },
      { src: "/photos/photo-2.jpg", x: "-160px", y: "32px", zIndex: 40, direction: "left", label: "Photo of me 😃" },
      { src: "/photos/photo-3.jpg", x: "0px", y: "8px", zIndex: 30, direction: "right", label: "Photo of me 😄" },
      { src: "/photos/photo-4.jpg", x: "160px", y: "22px", zIndex: 20, direction: "right", label: "Photo of me and my friends 😎" },
      { src: "/photos/photo-5.jpg", x: "320px", y: "44px", zIndex: 10, direction: "left", label: "Photo of me 😍" },
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
      overline: "Overview",
      heading: "About me",
      body: "I am a web developer who enjoys building things that look good and work even better. This site is where I try out new ideas, and figure out how to put them back together.",
      github: {
        username: "hoangngo-sudo",
      },
    },

    projects: {
      enabled: true,
      overline: "Standout Work",
      heading: "Featured Projects",
      viewAllUrl: "https://github.com/hoangngo-sudo",
      items: [
        {
          title: "drincatuic",
            description: "Student retreat event page",
          tags: ["HTML", "CSS", "Javascript", "GSAP", "webpack", "Supabase"],
          href: "https://github.com/hoangngo-sudo/drincatuic",
        },
        {
          title: "purpleit",
            description: "A Reddit inspired web application that empowers users to create posts, browse through a dynamic feed, leave comments, and upvote posts.",
          tags: ["React", "React Router", "Vite", "Javascript", "Supabase", "Bootstrap"],
          href: "https://github.com/hoangngo-sudo/purpleit",
        },
        {
          title: "the-morytale",
            description: "Narrative storytelling in an interactive application",
          tags: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Python"],
          href: "https://github.com/hoangngo-sudo/the-morytale",
        },
      ],
    },

    skills: {
      enabled: true,
      overline: "Capabilities",
      heading: "Highlighted Skills",
      categories: [
        {
          label: "Language",
          items: [
            { name: "Python" },
            { name: "C/C++" },
            { name: "Java" },
            { name: "HTML" },
            { name: "CSS" },
            { name: "JavaScript" },
            { name: "TypeScript" },
            { name: "SQLite" },
            { name: "Bash" },
          ],
        },
        {
          label: "Framework",
          items: [
            { name: "React" },
            { name: "Node.js" },
            { name: "p5.js" },
            { name: "Next.js" },
          ],
        },
        {
          label: "Tool",
          items: [
            { name: "Git" },
            { name: "GitHub" },
            { name: "Linux" },
            { name: "Docker" },
            { name: "VSCode" },
            { name: "Intellij" },
            { name: "AI" },
          ],
        },
      ],
    },

    courses: {
      enabled: true,
      overline: "Coursework",
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
            { code: "CS342", name: "Software Design", description: "Design patterns, architecture, and software engineering practices" },
            { code: "CS377", name: "Ethical Issues in Computing", description: "Privacy, security, AI ethics, and professional responsibility" },
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
      overline: "Digital Presence",
      heading: "Online",
      links: [
        {
          platform: "email",
          label: "mngo12332@gmail.com",
          href: "mailto:mngo12332@gmail.com",
          icon: "FiMail",
        },
        {
          platform: "instagram",
          label: "@hoaang.ngo",
          href: "https://www.instagram.com/hoaang.ngo/",
          icon: "FiInstagram",
        },
        {
          platform: "linkedin",
          label: "/in/hoang-minh-ngo/",
          href: "https://www.linkedin.com/in/hoang-minh-ngo/",
          icon: "FiLinkedin",
        },
        {
          platform: "github",
          label: "/hoangngo-sudo",
          href: "https://github.com/hoangngo-sudo",
          icon: "FiGithub",
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
