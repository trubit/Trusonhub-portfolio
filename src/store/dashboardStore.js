import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DASHBOARD_SECTIONS = {
  OVERVIEW: "overview",
  PROFILE: "profile",
  MEDIA: "media",
  RESUME: "resume",
  CV: "cv",
  PROJECTS: "projects",
  BLOG: "blog",
  MESSAGES: "messages",
  CERTIFICATES: "certificates",
  TESTIMONIALS: "testimonials",
  SETTINGS: "settings",
};

export const useDashboardStore = create(
  persist(
    (set) => ({
      activeSection: DASHBOARD_SECTIONS.OVERVIEW,
      sidebarOpen: true,

      setSection: (section) => set({ activeSection: section }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      openSidebar: () => set({ sidebarOpen: true }),
      closeSidebar: () => set({ sidebarOpen: false }),
    }),
    {
      name: "trusonhub-dashboard",
      partialize: (state) => ({ activeSection: state.activeSection, sidebarOpen: state.sidebarOpen }),
    },
  ),
);
