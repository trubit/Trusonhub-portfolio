import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { BlogSection } from "../components/dashboard/sections/BlogSection";
import { CertificatesSection } from "../components/dashboard/sections/CertificatesSection";
import { CvSection } from "../components/dashboard/sections/CvSection";
import { MediaSection } from "../components/dashboard/sections/MediaSection";
import { MessagesSection } from "../components/dashboard/sections/MessagesSection";
import { OverviewSection } from "../components/dashboard/sections/OverviewSection";
import { ProfileSection } from "../components/dashboard/sections/ProfileSection";
import { ProjectSection } from "../components/dashboard/sections/ProjectSection";
import { ResumeSection } from "../components/dashboard/sections/ResumeSection";
import { SettingsSection } from "../components/dashboard/sections/SettingsSection";
import { TestimonialsSection } from "../components/dashboard/sections/TestimonialsSection";
import { DASHBOARD_SECTIONS, useDashboardStore } from "../store/dashboardStore";

const SECTION_MAP = {
  [DASHBOARD_SECTIONS.OVERVIEW]: <OverviewSection />,
  [DASHBOARD_SECTIONS.PROFILE]: <ProfileSection />,
  [DASHBOARD_SECTIONS.MEDIA]: <MediaSection />,
  [DASHBOARD_SECTIONS.RESUME]: <ResumeSection />,
  [DASHBOARD_SECTIONS.CV]: <CvSection />,
  [DASHBOARD_SECTIONS.PROJECTS]: <ProjectSection />,
  [DASHBOARD_SECTIONS.BLOG]: <BlogSection />,
  [DASHBOARD_SECTIONS.MESSAGES]: <MessagesSection />,
  [DASHBOARD_SECTIONS.CERTIFICATES]: <CertificatesSection />,
  [DASHBOARD_SECTIONS.TESTIMONIALS]: <TestimonialsSection />,
  [DASHBOARD_SECTIONS.SETTINGS]: <SettingsSection />,
};

export const DashboardPage = () => {
  const activeSection = useDashboardStore((s) => s.activeSection);

  return (
    <DashboardLayout>
      {SECTION_MAP[activeSection] || <OverviewSection />}
    </DashboardLayout>
  );
};
