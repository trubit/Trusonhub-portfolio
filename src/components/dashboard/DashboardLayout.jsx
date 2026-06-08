import { useEffect } from "react";

import ArticleIcon from "@mui/icons-material/Article";
import BadgeIcon from "@mui/icons-material/Badge";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

import { DASHBOARD_SECTIONS, useDashboardStore } from "../../store/dashboardStore";
import "../../styles/dashboard.css";

const NAV_ITEMS = [
  { section: DASHBOARD_SECTIONS.OVERVIEW, label: "Overview", icon: <DashboardIcon fontSize="small" /> },
  { group: "Content" },
  { section: DASHBOARD_SECTIONS.PROFILE, label: "Profile Management", icon: <PersonIcon fontSize="small" /> },
  { section: DASHBOARD_SECTIONS.MEDIA, label: "Media Management", icon: <ImageIcon fontSize="small" /> },
  { section: DASHBOARD_SECTIONS.RESUME, label: "Resume", icon: <PictureAsPdfIcon fontSize="small" /> },
  { section: DASHBOARD_SECTIONS.CV, label: "CV", icon: <BadgeIcon fontSize="small" /> },
  { group: "Portfolio" },
  { section: DASHBOARD_SECTIONS.PROJECTS, label: "Projects", icon: <FolderIcon fontSize="small" /> },
  { section: DASHBOARD_SECTIONS.CERTIFICATES, label: "Certificates", icon: <StarIcon fontSize="small" /> },
  { section: DASHBOARD_SECTIONS.TESTIMONIALS, label: "Testimonials", icon: <VideoLibraryIcon fontSize="small" /> },
  { group: "Blog & Comms" },
  { section: DASHBOARD_SECTIONS.BLOG, label: "Blog Posts", icon: <ArticleIcon fontSize="small" /> },
  { section: DASHBOARD_SECTIONS.MESSAGES, label: "Messages", icon: <MailIcon fontSize="small" /> },
  { group: "Account" },
  { section: DASHBOARD_SECTIONS.SETTINGS, label: "Settings", icon: <SettingsIcon fontSize="small" /> },
];

const MOBILE_BREAKPOINT = 900;

export const DashboardLayout = ({ children }) => {
  const { activeSection, sidebarOpen, setSection, toggleSidebar, closeSidebar } = useDashboardStore();

  const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

  useEffect(() => {
    if (isMobile()) closeSidebar();
  }, []);

  const handleNavClick = (section) => {
    setSection(section);
    if (isMobile()) closeSidebar();
  };

  return (
    <div className="dashboard-root">
      <div
        className={`sidebar-overlay${sidebarOpen ? " visible" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside className={`dashboard-sidebar${sidebarOpen ? "" : " collapsed"}`}>
        <div className="sidebar-header">
          <span className="sidebar-brand">TrusonHub CMS</span>
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          {NAV_ITEMS.map((item, idx) => {
            if (item.group) {
              return (
                <div key={`group-${idx}`} className="sidebar-section-label">
                  {item.group}
                </div>
              );
            }

            return (
              <button
                key={item.section}
                className={`sidebar-item${activeSection === item.section ? " active" : ""}`}
                onClick={() => handleNavClick(item.section)}
                title={item.label}
                aria-current={activeSection === item.section ? "page" : undefined}
              >
                {item.icon}
                <span className="sidebar-item-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="dashboard-main">
        <button
          className="dashboard-mobile-toggle"
          onClick={toggleSidebar}
          aria-label="Open navigation menu"
        >
          <MenuIcon fontSize="small" />
          <span>Menu</span>
        </button>

        {children}
      </main>
    </div>
  );
};
