# *Portfolio Template* project

A config-driven developer portfolio built with **Next.js 16**, **Base UI**, **Tailwind CSS v4**, and **Motion**. Ships a polished single-page layout with photo gallery hero, interactive 3D globe, GitHub contribution heatmap, and fuzzy search; all controlled from one config file.

## Architecture

```mermaid
flowchart TB
    USER([User]) --> HERO["HeroSection<br/>Photo gallery + headline"]
    HERO --> |Scroll| SYNOPSIS["SynopsisSection<br/>About me + GitHub heatmap + Globe"]
    HERO --> |Scroll| PROJECTS["ProjectsSection<br/>SpotlightCard project cards"]
    HERO --> |Scroll| SKILLS["SkillsSection<br/>Infinite marquee by category"]
    HERO --> |Scroll| COURSES["CoursesSection<br/>SpotlightCard coursework"]
    HERO --> |Scroll| CONTACT["ContactSection<br/>Social links"]

    USER --> |Cmd+K| SEARCH["SearchOverlay<br/>Fuse.js fuzzy search"]

    SYNOPSIS --> |GraphQL| GITHUB[("GitHub API<br/>Contribution data")]
    GITHUB --> |ISR cached| HEATMAP["GitHubHeatmap<br/>Contribution graph + AnimateNumber tooltip"]
    SYNOPSIS --> GLOBE["Globe3D<br/>cobe WebGL + haptic drag"]

    PROJECTS --> |REST| GHREST[("GitHub API<br/>Commit activity")]
    GHREST --> |ISR cached| COMMITS["ProjectCommitsWidget<br/>12-week sparkline"]

    USER --> |Toggle| THEME{"Black / Teal Theme"}
    THEME --> |localStorage| USER

    USER --> |Drag / Tap | HAPTICS["web-haptics<br/>Detent + light + medium"]

    USER --> |Scroll| PROGRESS["ScrollProgressBar"]
    USER --> |Scroll down| FAB["BackToTopFAB"]
```

## Features

- **Config-driven** Edit a single `portfolio.config.ts`
- **Photo gallery hero** Desktop fanned layout with spring arc tooltip labels; mobile swipeable card stack; staggered entrance animations
- **Interactive 3D globe** `cobe` WebGL globe in the about section with drag rotation and haptic detents (picks up every ~15° like a scroll wheel)
- **GitHub heatmap** Contribution graph fetched from GitHub GraphQL API with ISR caching; animated tooltip with `AnimateNumber` digit-flip for counts and date parts; placeholder fallback when no token is set
- **Fuzzy search overlay** Cmd+K / Ctrl+K triggers Fuse.js-powered search across all sections with action links; tags indexed separately from display text
- **Project commit sparklines** Per-project GitHub commit activity for the last 12 weeks
- **2 color themes** Black and Teal, switchable at runtime with `localStorage` persistence and flash-free hydration
- **Scroll progress bar** + **Back-to-top FAB** toggleable via feature flags
- **Infinite skill marquee** Skills scrolled in three velocity-smoothed `requestAnimationFrame` loops (by Language, Framework, Tool), one scrolling right one left
- **SpotlightCard** Project and coursework cards with a radial-gradient glow that follows the cursor, theme-aware accent color
- **Shadow elevation** Two-tier depth system: `dm-elevation-2` for dark sections and 3-layer stacked shadow `elevation-2` for light sections
- **Keycap buttons** Skeuomorphic keyboard-key style for the search trigger, hero nav chips, and back-to-top FAB; animated rainbow glow ring; colors adapt to the active theme
- **Web haptics** Touch feedback on chips, drags, globe rotation and keycap taps
- **Themed scrollbar** Thin accent-colored scrollbar consistent across all scroll containers
- **Accessible** Skip-to-content link, semantic HTML, keyboard navigation, `prefers-reduced-motion` support
- **SEO** Open Graph tags, JSON-LD Person schema, semantic heading hierarchy
- **Performance** Static generation, Geist font family via `next/font` for zero-FOUT, Tailwind v4

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
        FM["Motion 12<br/>motion/react + motion"] 
        FMP["Motion Plus<br/>AnimateNumber digit-flip"]
    end

    subgraph Data
        FUSE["Fuse.js<br/>Fuzzy search"]
        GHAPI["GitHub GraphQL API<br/>Contribution heatmap"]
        GHREST["GitHub REST API<br/>Commit activity"]
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

    subgraph Globe
        COBE["COBE<br/>WebGL globe renderer"]
    end

    NEXT --> TW
    NEXT --> BASEUI
    NEXT --> FM
    NEXT --> FMP
    NEXT --> FUSE
    NEXT --> GHAPI
    NEXT --> GHREST
    NEXT --> GEIST
    NEXT --> RI
    NEXT --> WH
    NEXT --> COBE
```

| Dependency | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | App Router framework with React 19 |
| [Base UI](https://base-ui.com/) | Unstyled, accessible UI primitives |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Motion 12](https://motion.dev/) | Spring animations from `motion/react` + `motion` for vanilla scroll utility |
| [Motion Plus](https://motion.dev/) | `AnimateNumber` for animated digit-flip counters |
| [Fuse.js](https://www.fusejs.io/) | Client-side fuzzy search |
| [Geist](https://vercel.com/font) | Sans, Mono, and Pixel font families via `next/font` |
| [react-icons](https://react-icons.github.io/react-icons/) | Feather (Fi) icons for contacts/search; Simple Icons (Si) for skill logos |
| [web-haptics](https://haptics.lochie.me/) | Touch haptic feedback |
| [COBE](https://cobe.vercel.app/) | WebGL globe renderer |
| [sharp](https://sharp.pixelplumbing.com/) | Image optimization at build time |
| Vercel | Recommended hosting with ISR support |

## <a name="credits">Acknowledgment</a>

This project would not be possible without the following open-source projects:

- Haptic feedback from [web-haptics](https://haptics.lochie.me/)
- Fuzzy search from [Fuse.js](https://www.fusejs.io/)
- Accessible UI primitives from [Base UI](https://base-ui.com/)
- Clipped WebGL globe card aesthetic from [COBE](https://cobe.vercel.app/)

This project has been inspired by the following websites and designs:

- [braydoncoyer.dev](https://www.braydoncoyer.dev/): hero section gallery images display with spring-animated photo fan-out
- [anirudhkuppili.com](https://anirudhkuppili.com): layout structure, section hierarchy, color theming system, and overall visual language
- [Aceternity UI](https://ui.aceternity.com/): `ArcTooltip` animated tooltip pattern, and `SpotlightCard` cursor-following radial gradient
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
│   │   ├── page.tsx                # Single page: conditionally renders sections from config
│   │   ├── robots.ts               # robots.txt metadata route
│   │   ├── sitemap.ts              # sitemap.xml metadata route
│   │   └── globals.css             # Tailwind v4 + CSS custom properties + scrollbar
│   ├── components/
│   │   ├── providers/
│   │   │   ├── ThemeProvider.tsx    # Theme context + localStorage sync
│   │   │   └── ThemeScript.tsx      # Inline script for flash-free theme init
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx                 # Photo gallery + headline + stagger entrance
│   │   │   ├── SynopsisSection.tsx             # About + GitHub heatmap + globe
│   │   │   ├── ProjectsSection.tsx             # SpotlightCard project cards (dark)
│   │   │   ├── SkillsSection.tsx               # LogoLoop marquee per skill category (light)
│   │   │   ├── CoursesSection.tsx              # SpotlightCard coursework (dark)
│   │   │   └── ContactSection.tsx              # Social link Chips with react-icons (light)
│   │   └── ui/
│   │       ├── ArcTooltip.tsx           # Spring-animated arc tooltip for photo labels
│   │       ├── BackToTopFAB.tsx         # Keycap-styled floating action button
│   │       ├── CardStack.tsx            # Mobile: swipeable photo card stack with 3D tilt
│   │       ├── Chip.tsx                 # Tag / link chip (flat CSS + keycap variant)
│   │       ├── GitHubHeatmap.tsx        # Contribution graph (theme-aware SVG + AnimateNumber tooltip)
│   │       ├── Globe3D.tsx              # cobe WebGL interactive globe with haptic drag detents
│   │       ├── GlobeCard.tsx            # Clipped globe card wrapper
│   │       ├── KeycapButton.tsx         # Skeuomorphic keycap shell + rainbow glow (search trigger)
│   │       ├── LogoLoop.tsx             # Infinite velocity-smoothed RAF marquee
│   │       ├── Photo.tsx                # Single draggable photo with ArcTooltip
│   │       ├── PhotoGallery.tsx         # Desktop: staggered spring photo fan-out
│   │       ├── ProjectCommitsWidget.tsx # Per-project GitHub commit sparkline
│   │       ├── ScrollProgressBar.tsx    # Fixed top scroll indicator
│   │       ├── SearchOverlay.tsx        # Cmd+K fuzzy search (Fuse.js + Base UI Dialog)
│   │       ├── SectionWrapper.tsx       # Shared section layout (dark / light variants, no animation)
│   │       ├── SpotlightCard.tsx        # Polymorphic card with cursor-following radial glow
│   │       └── ThemeToggle.tsx          # Black and Teal theme switcher
│   ├── config/
│   │   └── portfolio.config.ts     # Single-file site configuration
│   ├── lib/
│       ├── clock.ts               # Realtime clock helpers
│       ├── color.ts               # Color manipulation utilities
│       ├── github.ts              # GitHub GraphQL client (ISR cached)
│       ├── scroll.ts              # Spring-animated scroll utilities
│       └── search.ts              # Fuse.js search index builder
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
