import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/routing/ProtectedRoute.jsx";
import { AppNavbar } from "./components/layout/AppNavbar.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { AdminLoginPage } from "./pages/AdminLoginPage.jsx";
import { BlogPage } from "./pages/BlogPage.jsx";
import { CareerPage } from "./pages/CareerPage.jsx";
import { ContactPage } from "./pages/ContactPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { MediaPage } from "./pages/MediaPage.jsx";
import { PortfolioPage } from "./pages/PortfolioPage.jsx";
import { ProjectsPage } from "./pages/ProjectsPage.jsx";
import { ResumePage } from "./pages/ResumePage.jsx";
import { ServicesPage } from "./pages/ServicesPage.jsx";

function App() {
  return (
    <div className="app-root">
      <AppNavbar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute adminOnly>
                <DashboardPage />
              </ProtectedRoute>
            )}
          />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
