import type { PortfolioConfig } from "@/types/config";

const config: PortfolioConfig = {
  meta: {
    name: "Hoang Minh Ngo",
    headline: "Hey there, I am Hoang",
    description: "I am an aspiring web developer who enjoys building websites.",
    siteUrl: "https://hoaangngo.com",
    ogImage: "/og.png",
  },

  themes: {
    black: {
      accent: "#b3b3b3",
      accentLight: "#d4d4d4",
      accentPale: "#f1f1f1",
      darkBg: "#111111",
      darkBgAlt: "#232323",
      lightBg: "#ffffff",
      lightBgAlt: "#f8f8f8",
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
      body: "My name is Hoang Ngo. I grew up in Ho Chi Minh City (HCMC), Vietnam, and now I am studying Computer Science in Chicago, Illinois. I got into CS because I like building things that help people.\n\nMost of my time goes into web development. I care a lot about how things feel. A good interface should feel like second nature, where you do not have to think about what to click next.\n\nLately I have been spending more time on the backend side too. How data gets stored and served, how APIs connect different pieces, and how to make sure everything stays up and running. A website that looks nice but breaks when you use it is not very useful. I want to build things that work well all the way through, from the database to the screen and to user experience.\n\nOutside of code, I read bible and study bible daily to know more about Jesus, my savior. My faith in God keeps me grounded through all of the work I do.",
      github: {
        username: "hoangngo-sudo",
      },
      globe: {
        heading: "From HCMC to Chicago",
        markers: [
          { lat: 10.8231, lng: 106.6297, src: "/photos/photo-1.jpg", label: "Ho Chi Minh City, Vietnam" },
          { lat: 41.8781, lng: -87.6298, src: "/photos/photo-1.jpg", label: "Chicago, Illinois" },
        ],
        atmosphereColor: "#0d9488",
        atmosphereIntensity: 15,
        autoRotateSpeed: 0.3,
      },
    },

    projects: {
      enabled: true,
      overline: "",
      heading: "Featured Projects",
      viewAllUrl: "https://github.com/hoangngo-sudo",
      items: [
        {
          title: "drincatuic",
            description: "Student retreat event page",
          repo: "hoangngo-sudo/drincatuic",
          tags: ["HTML", "CSS", "Javascript", "Supabase"],
          href: "https://github.com/hoangngo-sudo/drincatuic",
        },
        {
          title: "purpleit",
            description: "A Reddit inspired web application that empowers users to create posts, browse through a dynamic feed, leave comments, and upvote posts.",
          repo: "hoangngo-sudo/purpleit",
          tags: ["React", "Vite", "Javascript", "Supabase", "Bootstrap"],
          href: "https://github.com/hoangngo-sudo/purpleit",
        },
        {
          title: "the-morytale",
            description: "Narrative storytelling in an interactive application",
          repo: "hoangngo-sudo/the-morytale",
          tags: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Python"],
          href: "https://github.com/hoangngo-sudo/the-morytale",
        },
      ],
    },

    skills: {
      enabled: true,
      overline: "",
      heading: "Skills",
      stackDescription: [
        { type: "text", content: "My main stack is " },
        { type: "pill", name: "React", icon: "react" },
        { type: "text", content: " and " },
        { type: "pill", name: "Next.js", icon: "nextjs" },
        { type: "text", content: " for building full-stack website, with " },
        { type: "pill", name: "JavaScript", icon: "javascript" },
        { type: "text", content: " as my language. Everything is version-controlled with " },
        { type: "pill", name: "Git", icon: "git" },
        { type: "text", content: " and deployed through " },
        { type: "pill", name: "GitHub", icon: "github" },
        { type: "text", content: ". " },
        { type: "text", content: "For database management, I use " },
        { type: "pill", name: "Supabase", icon: "supabase" },
        { type: "text", content: " (I am learning backend so bear with me of what I could do right now is using service *smiling face*). At last, but not least, I use " },
        { type: "pill", name: "VSCode", icon: "vscode" },
        { type: "text", content: " IDE with assisted from AI agent to create awesome projects." },
      ],
      categories: [
        {
          label: "Language",
          items: [
            { name: "Python", icon: "python" },
            { name: "C/C++", icon: "cpp" },
            { name: "Java", icon: "java" },
            { name: "HTML", icon: "html" },
            { name: "CSS", icon: "css" },
            { name: "JavaScript", icon: "javascript" },
            { name: "TypeScript", icon: "typescript" },
            { name: "SQLite", icon: "sqlite" },
            { name: "Bash", icon: "bash" },
          ],
        },
        {
          label: "Framework",
          items: [
            { name: "React", icon: "react" },
            { name: "Node.js", icon: "nodejs" },
            { name: "p5.js", icon: "p5js" },
            { name: "Next.js", icon: "nextjs" },
          ],
        },
        {
          label: "Tool",
          items: [
            { name: "Git", icon: "git" },
            { name: "GitHub", icon: "github" },
            { name: "Linux", icon: "linux" },
            { name: "Docker", icon: "docker" },
            { name: "VSCode", icon: "vscode" },
            { name: "Figma", icon: "figma" },
            { name: "IntelliJ", icon: "intellij" }
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
