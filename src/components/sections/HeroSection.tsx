"use client";

import { useCallback } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import config from "@/config/portfolio.config";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Chip } from "@/components/ui/Chip";
import { SearchOverlay } from "@/components/ui/SearchOverlay";
import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { CardStack } from "@/components/ui/CardStack";
import { StaggeredBlurText } from "@/components/ui/StaggeredBlurText";
import { smoothScrollToId } from "@/lib/scroll";
import { useLocalClock } from "@/lib/clock";
import { useWebHaptics } from "web-haptics/react";

const heroBlockVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.3 },
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.215, 0.61, 0.355, 1] },
  },
};

export function HeroSection() {
  const { meta, nav, features, hero } = config;
  const shouldReduceMotion = useReducedMotion();
  const haptic = useWebHaptics();
  const clock = useLocalClock();

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const href = e.currentTarget.getAttribute("href");
      if (href?.startsWith("#")) {
        e.preventDefault();
        smoothScrollToId(href.slice(1));
      }
    },
    []
  );

  const navContent = (
    <>
      {nav.links.map((link) => (
        <Chip
          key={link.label}
          label={link.label}
          href={link.href}
          external={link.external}
          download={link.download}
          onClick={(e) => {
            haptic.trigger("medium");
            if (link.href?.startsWith("#")) handleAnchorClick(e);
          }}
          keycap
        />
      ))}
      {features.searchOverlay && <SearchOverlay />}
    </>
  );

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-dark-bg px-[5%] py-16 text-center">
      {/* ThemeToggle */}
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <div>
        {/* Location which replays on scroll-back */}
        <StaggeredBlurText
          as="p"
          text={meta.title}
          replay
          delay={0}
          stagger={0.04}
          duration={0.5}
          blurAmount={8}
          yOffset={10}
          className="mb-1 font-mono text-xs uppercase tracking-[2px] text-text-secondary"
        />
        {clock && (
          <StaggeredBlurText
            as="p"
            text={clock}
            replay
            delay={0.15}
            stagger={0.03}
            duration={0.45}
            blurAmount={6}
            yOffset={8}
            targetOpacity={0.7}
            className="mb-3 font-mono text-xs tracking-[2px] text-text-secondary"
          />
        )}

        {/* replays on scroll-back */}
        <StaggeredBlurText
          as="h1"
          text={meta.headline}
          replay
          delay={shouldReduceMotion ? 0 : 0.3}
          stagger={0.05}
          duration={0.55}
          blurAmount={10}
          yOffset={14}
          className="mb-4 max-w-2xl text-balance font-heading text-4xl font-bold text-white md:text-6xl"
        />

        {/* Nav + gallery + card stack to be in a single staggered parent */}
        <motion.div
          variants={heroBlockVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
        >
          {/* Nav buttons */}
          <motion.div
            variants={heroItemVariants}
            className="flex flex-wrap items-center justify-center gap-3 text-text-secondary"
          >
            {navContent}
          </motion.div>

          {/* Desktop photo gallery */}
          <motion.div variants={heroItemVariants}>
            <PhotoGallery photos={hero.desktopPhotos} animationDelay={0} />
          </motion.div>

          {/* Mobile card stack */}
          <motion.div
            variants={heroItemVariants}
            className="mt-8 flex items-center justify-center lg:hidden"
          >
            <CardStack images={hero.mobilePhotos} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
