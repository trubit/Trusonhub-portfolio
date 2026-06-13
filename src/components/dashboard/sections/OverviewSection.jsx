import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import FolderIcon from "@mui/icons-material/Folder";
import MailIcon from "@mui/icons-material/Mail";
import ImageIcon from "@mui/icons-material/Image";

import { getAdminBlogPostsRequest } from "../../../api/blogApi";
import { getAdminContactMessagesRequest } from "../../../api/contactApi";
import { getMyProjectsRequest } from "../../../api/projectApi";
import { getCertificatesRequest } from "../../../api/certificateApi";
import { useAuth } from "../../../hooks/useAuth";
import { DASHBOARD_SECTIONS, useDashboardStore } from "../../../store/dashboardStore";

export const OverviewSection = () => {
  const { user } = useAuth();
  const setSection = useDashboardStore((s) => s.setSection);

  const projectsQ = useQuery({ queryKey: ["my-projects"], queryFn: getMyProjectsRequest });
  const blogQ = useQuery({ queryKey: ["admin-blog-posts"], queryFn: getAdminBlogPostsRequest });
  const messagesQ = useQuery({ queryKey: ["admin-contact-messages"], queryFn: getAdminContactMessagesRequest });
  const certsQ = useQuery({ queryKey: ["certificates"], queryFn: getCertificatesRequest });

  const unread = (messagesQ.data || []).filter((m) => m.status === "new").length;

  return (
    <>
      <div className="section-page-header">
        <h2>Welcome back, {user?.fullName?.split(" ")[0] || "Admin"}</h2>
        <p>Your portfolio CMS — all content management happens here.</p>
      </div>

      <div className="overview-stats">
        <div className="stat-card">
          <span className="stat-card-label">Projects</span>
          <span className="stat-card-value">{projectsQ.isLoading ? "—" : (projectsQ.data?.length ?? 0)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Blog Posts</span>
          <span className="stat-card-value">{blogQ.isLoading ? "—" : (blogQ.data?.length ?? 0)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">New Messages</span>
          <span className="stat-card-value">{messagesQ.isLoading ? "—" : unread}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Certificates</span>
          <span className="stat-card-value">{certsQ.isLoading ? "—" : (certsQ.data?.length ?? 0)}</span>
        </div>
      </div>

      <div className="cms-card">
        <div className="cms-card-title">Quick Actions</div>
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.5 }}>
          <Button variant="contained" startIcon={<FolderIcon />} onClick={() => setSection(DASHBOARD_SECTIONS.PROJECTS)}>
            Manage Projects
          </Button>
          <Button variant="outlined" startIcon={<ImageIcon />} onClick={() => setSection(DASHBOARD_SECTIONS.MEDIA)}>
            Manage Media
          </Button>
          <Button variant="outlined" startIcon={<ArticleIcon />} onClick={() => setSection(DASHBOARD_SECTIONS.BLOG)}>
            Write Blog Post
          </Button>
          <Button variant="outlined" startIcon={<MailIcon />} onClick={() => setSection(DASHBOARD_SECTIONS.MESSAGES)}>
            View Messages {unread > 0 ? `(${unread} new)` : ""}
          </Button>
        </Stack>
      </div>

      <div className="cms-card">
        <div className="cms-card-title">Public Site Links</div>
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
          {[
            { label: "Home", to: "/" },
            { label: "About", to: "/about" },
            { label: "Portfolio", to: "/portfolio" },
            { label: "Projects", to: "/projects" },
            { label: "Media", to: "/media" },
            { label: "Resume", to: "/resume" },
          ].map((link) => (
            <Button key={link.to} size="small" variant="text" component={Link} to={link.to} target="_blank">
              {link.label} ↗
            </Button>
          ))}
        </Stack>
      </div>
    </>
  );
};
