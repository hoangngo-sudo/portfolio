# *Portfolio Template* project

A config-driven developer portfolio built with **Next.js 16**, **Base UI**, **Tailwind CSS v4**, and **Framer Motion**. Ships a polished single-page layout with photo gallery hero, GitHub contribution heatmap, and fuzzy search; All controlled from one config file.

## Architecture

```mermaid
flowchart TB
    USER([User]) --> HERO["HeroSection<br/>Photo gallery + headline"]
    HERO --> |Scroll| SYNOPSIS["SynopsisSection<br/>About me + GitHub heatmap"]
    HERO --> |Scroll| PROJECTS["ProjectsSection<br/>SpotlightCard project cards"]
    HERO --> |Scroll| SKILLS["SkillsSection<br/>Infinite marquee by category"]
    HERO --> |Scroll| COURSES["CoursesSection<br/>SpotlightCard coursework"]
    HERO --> |Scroll| CONTACT["ContactSection<br/>Social links"]

    USER --> |Cmd+K| SEARCH["SearchOverlay<br/>Fuse.js fuzzy search"]

    SYNOPSIS --> |GraphQL| GITHUB[("GitHub API<br/>Contribution data")]
    GITHUB --> |ISR cached| HEATMAP["GitHubHeatmap<br/>Contribution graph"]

    USER --> |Toggle| THEME{"Black / Teal Theme"}
    THEME --> |localStorage| USER

    USER --> |Scroll| PROGRESS["ScrollProgressBar"]
    USER --> |Scroll down| FAB["BackToTopFAB"]
```

## Features

- **Config-driven** Edit a single `portfolio.config.ts`
- **Photo gallery hero** Desktop fanned layout with arc tooltip labels; mobile swipeable card stack; staggered entrance animations
- **GitHub heatmap** Contribution graph fetched from GitHub GraphQL API with ISR caching; placeholder fallback when no token is set
- **Fuzzy search overlay** Cmd+K / Ctrl+K triggers Fuse.js-powered search across all sections with action links
- **2 color themes** Black and Teal, switchable at runtime with `localStorage` persistence and flash-free hydration
- **Scroll progress bar** + **Back-to-top FAB** toggleable via feature flags
- **Infinite skill marquee** Skills scrolled in three velocity-smoothed `requestAnimationFrame` loops (by Language, Framework, Tool), one scrolling right one left
- **SpotlightCard** Project and coursework cards with a radial-gradient glow that follows the cursor, theme-aware accent color
- **Shadow elevation** Two-tier depth system: `dm-elevation-2` for dark sections (inset highlight + ring + drop) and `elevation-2` for light sections (3-layer stacked shadow)
- **Keycap buttons** Skeuomorphic keyboard-key style for the search trigger, hero nav chips, and back-to-top FAB; animated rainbow glow ring; colors adapt to the active theme
- **Accessible** Skip-to-content link, semantic HTML, keyboard navigation, `prefers-reduced-motion` support
- **SEO** Open Graph tags, JSON-LD Person schema, semantic heading hierarchy
- **Performance** Static generation, Geist font family via `next/font` for zero-FOUT, Tailwind v4 (zero runtime CSS)

## Tech Stack

```mermaid
graph TD
    subgraph Framework
        NEXT["Next.js 16<br/>App Router + React 19"]
    end

    subgraph Styling
        TW["Tailwind CSS v4<br/>Zero runtime"]
        BASEUI["Base UI v1.x<br/>Unstyled primitives"]
    end

    subgraph Animation
        FM["Framer Motion 12<br/>Layout + scroll animations"]
    end

    subgraph Data
        FUSE["Fuse.js<br/>Fuzzy search"]
        GHAPI["GitHub GraphQL API<br/>Contribution heatmap"]
    end

    subgraph Fonts
        GEIST["Geist<br/>Sans + Mono + Pixel families"]
    end

    subgraph Icons
        RI["react-icons<br/>Feather + Simple Icons sets"]
    end

    subgraph Haptics
        WH["web-haptics<br/>Touch feedback"]
    end

    NEXT --> TW
    NEXT --> BASEUI
    NEXT --> FM
    NEXT --> FUSE
    NEXT --> GHAPI
    NEXT --> GEIST
    NEXT --> RI
    NEXT --> WH
```

| Dependency | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | App Router framework with React 19 |
| [Base UI](https://base-ui.com/) | Unstyled, accessible UI primitives |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion 12](https://motion.dev/) | Layout animations, staggered entrances, scroll-driven effects |
| [Fuse.js](https://www.fusejs.io/) | Client-side fuzzy search |
| [Geist](https://vercel.com/font) | Sans, Mono, and Pixel font families via `next/font` |
| [react-icons](https://react-icons.github.io/react-icons/) | Feather (Fi) icons for contacts/search; Simple Icons (Si) for skill logos |
| [web-haptics](https://haptics.lochie.me/) | Touch haptic feedback |
| [sharp](https://sharp.pixelplumbing.com/) | Image optimization at build time |
| Vercel | Recommended hosting with ISR support |

## <a name="credits">Acknowledgment</a>

This project would not be possible without the following open-source projects:

- Haptic feedback from [web-haptics](https://haptics.lochie.me/)
- Fuzzy search from [Fuse.js](https://www.fusejs.io/)
- Accessible UI primitives from [Base UI](https://base-ui.com/)
- Clipped WebGL globe card aesthetic from [COBE](https://cobe.vercel.app/)

This project has been inspired by the following websites and designs:

- [anirudhkuppili.com](https://anirudhkuppili.com): layout structure, section hierarchy, color theming system, and overall visual language
- [Aceternity UI](https://ui.aceternity.com/): `ArcTooltip` animated tooltip pattern, `SpotlightCard` cursor-following radial gradient, and globe card aesthetic
- [Keycap Button](https://dribbble.com/shots/25117095--Keycap-Button): Skeuomorphic keycap button CSS

## Quick Start

```bash
# Clone
git clone <your-repo-url> my-portfolio
cd my-portfolio

# Install
npm install

# Configure — edit with your info
# src/config/portfolio.config.ts

# Dev
npm run dev

# Build
npm run build
```

## Configuration

All content lives in [`src/config/portfolio.config.ts`](src/config/portfolio.config.ts).

| Section | Description |
|---|---|
| `meta` | Name, title, headline, description, production URL (`siteUrl`), OG image |
| `themes` | Black and Teal color definitions, default theme |
| `nav` | Navigation links (supports `external` and `download` flags) |
| `hero` | Desktop photo positions + mobile photo list |
| `sections.*` | Each section has `enabled: boolean` + content data |
| `features` | Toggle search overlay, scroll progress, back-to-top, GitHub heatmap |

### GitHub Heatmap

To display real contribution data, create a `.env.local` file:

```
GITHUB_TOKEN=ghp_your_personal_access_token
```

The token needs the `read:user` scope. Without a token, a placeholder heatmap is displayed.

### Images

Place images in the `public/` directory:

```
public/
├── photos/          # Hero gallery photos
├── og.png           # Open Graph image (1200×630 recommended)
├── resume.pdf       # Downloadable resume
└── favicon.ico
```

Hero photos use `next/image` with `fill` layout for native lazy loading and zero layout shift.

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, fonts, theme init, JSON-LD, metadata API
│   │   ├── page.tsx                # Page shell
│   │   ├── robots.ts               # robots.txt metadata route (static-export compatible)
│   │   ├── sitemap.ts              # sitemap.xml metadata route (static-export compatible)
│   │   └── globals.css             # Tailwind v4 + CSS custom properties
│   ├── components/
│   │   ├── providers/
│   │   │   └── ThemeProvider        # Theme context + localStorage sync
│   │   ├── sections/
│   │   │   ├── HeroSection          # Photo gallery + headline + stagger entrance
│   │   │   ├── SynopsisSection      # About + GitHub heatmap (async server component)
│   │   │   ├── ProjectsSection      # SpotlightCard project cards (dark)
│   │   │   ├── SkillsSection        # LogoLoop marquee per skill category (light)
│   │   │   ├── CoursesSection       # SpotlightCard coursework (dark)
│   │   │   └── ContactSection       # Social link Chips with react-icons (light)
│   │   └── ui/
│   │       ├── ArcTooltip           # Curved tooltip for photo labels
│   │       ├── BackToTopFAB         # Keycap-styled floating action button
│   │       ├── CardStack            # Mobile: swipeable photo card stack
│   │       ├── Chip                 # Tag / link chip (flat or keycap variant)
│   │       ├── GitHubHeatmap        # Contribution graph (theme-aware SVG)
│   │       ├── KeycapButton         # Skeuomorphic keycap shell + rainbow glow (search trigger)
│   │       ├── LogoLoop             # Infinite velocity-smoothed RAF marquee
│   │       ├── Photo                # Single draggable photo with ArcTooltip (`next/image`)
│   │       ├── PhotoGallery         # Desktop: staggered spring photo fan-out
│   │       ├── ScrollProgressBar    # Fixed top scroll indicator
│   │       ├── SearchOverlay        # Cmd+K fuzzy search (Fuse.js + Base UI Dialog)
│   │       ├── SectionWrapper       # Shared section layout (dark / light variants)
│   │       ├── SpotlightCard        # Polymorphic card with cursor-following radial glow
│   │       └── ThemeToggle          # Black ↔ Teal switcher
│   ├── config/
│   │   └── portfolio.config.ts     # Single-file site configuration
│   ├── lib/
│   │   ├── github.ts               # GitHub GraphQL client (ISR cached)
│   │   ├── scroll.ts               # Spring-animated scroll utilities
│   │   └── search.ts               # Fuse.js search setup
│   └── types/
│       └── config.ts               # TypeScript config interfaces
└── public/
    ├── photos/                     # Hero gallery images
    ├── og.png                      # Open Graph image (1200×630)
    └── resume.pdf                  # Downloadable resume
```

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Or build and serve statically:

```bash
npm run build
npm start
```

## License

MIT
