import config from "@/config/portfolio.config";
import { HeroSection } from "@/components/sections/HeroSection";
import { SynopsisSection } from "@/components/sections/SynopsisSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { CoursesSection } from "@/components/sections/CoursesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { BackToTopFAB } from "@/components/ui/BackToTopFAB";

const { sections, features } = config;

export default function Page() {
  return (
    <>
      {features.scrollProgress && <ScrollProgressBar />}

      <main id="main-content">
        <HeroSection />

        {sections.synopsis?.enabled && (
          <SynopsisSection data={sections.synopsis} />
        )}

        {sections.projects?.enabled && (
          <ProjectsSection data={sections.projects} />
        )}

        {sections.skills?.enabled && (
          <SkillsSection data={sections.skills} />
        )}

        {sections.courses?.enabled && (
          <CoursesSection data={sections.courses} />
        )}

        {sections.contact?.enabled && (
          <ContactSection data={sections.contact} />
        )}
      </main>

      {features.backToTop && <BackToTopFAB />}
    </>
  );
}
