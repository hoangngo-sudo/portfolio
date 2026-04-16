"use client";

import { useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import config from "@/config/portfolio.config";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Chip } from "@/components/ui/Chip";
import { SearchOverlay } from "@/components/ui/SearchOverlay";
import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { CardStack } from "@/components/ui/CardStack";
import { smoothScrollToId } from "@/lib/scroll";
import { useWebHaptics } from "web-haptics/react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween" as const,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1], // ease-out-cubic
    },
  },
};

export function HeroSection() {
  const { meta, nav, features, hero } = config;
  const shouldReduceMotion = useReducedMotion();
  const haptic = useWebHaptics();

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

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-dark-bg px-[5%] py-16 text-center">
      {/* ThemeToggle — top-right on desktop, centered on mobile */}
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <motion.div
        variants={containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
      >
        <motion.p
          variants={itemVariants}
          className="mb-3 text-xs font-semibold uppercase tracking-[4px] text-text-secondary"
        >
          {meta.title}
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="mb-4 text-balance font-heading text-4xl font-bold text-white md:text-6xl"
        >
          {meta.headline}
        </motion.h1>

        <motion.p variants={itemVariants} className="mb-8 text-lg text-text-secondary">
          {meta.description}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 text-text-secondary"
        >
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
        </motion.div>

        {/* Desktop photo gallery */}
        <motion.div variants={itemVariants}>
          <PhotoGallery photos={hero.desktopPhotos} animationDelay={0.9} />
        </motion.div>

        {/* Mobile card stack */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex items-center justify-center lg:hidden"
        >
          <CardStack images={hero.mobilePhotos} />
        </motion.div>
      </motion.div>
    </section>
  );
}
