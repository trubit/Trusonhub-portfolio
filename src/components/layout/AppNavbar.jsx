import { useMemo, useState } from "react";

import { Button, Container, Navbar } from "react-bootstrap";
import { FiBriefcase, FiLogOut, FiMoon, FiShield, FiSun } from "react-icons/fi";
import { Link, NavLink, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { useThemeStore } from "../../store/themeStore";

const navLinks = [
  { to: "/",         label: "Home",      end: true },
  { to: "/about",    label: "About" },
  { to: "/portfolio",label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/blog",     label: "Blog" },
  { to: "/media",    label: "Media" },
  { to: "/resume",   label: "Resume" },
  { to: "/career",   label: "Career" },
  { to: "/contact",  label: "Contact" },
];

const NavItems = ({ onNavigate }) => (
  <>
    {navLinks.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end ?? false}
        onClick={onNavigate}
        className={({ isActive }) =>
          `elite-nav-link${isActive ? " is-active" : ""}`
        }
      >
        {item.label}
      </NavLink>
    ))}
  </>
);

export const AppNavbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const adminCta = useMemo(
    () => (isAuthenticated ? "/dashboard" : "/admin/login"),
    [isAuthenticated],
  );

  const closeMenu = () => setExpanded(false);

  return (
    <Navbar
      className="elite-navbar"
      expand="lg"
      sticky="top"
      expanded={expanded}
      onToggle={(next) => setExpanded(Boolean(next))}
    >
      <Container className="elite-navbar-inner" fluid="xxl">
        <Link to="/" className="elite-brand" onClick={closeMenu}>
          <span className="elite-brand-icon" aria-hidden="true">
            <FiBriefcase />
          </span>
          <span className="elite-brand-text">
            <strong>EZIKA TRUST CHIDI</strong>
            <small>FULL STACK PORTFOLIO</small>
          </span>
        </Link>

        <Navbar.Toggle
          className="elite-menu-toggle"
          aria-controls="elite-navbar-collapse"
        />

        <Navbar.Collapse
          id="elite-navbar-collapse"
          className="elite-navbar-collapse"
        >
          <div className="elite-navbar-center">
            <NavItems onNavigate={closeMenu} />
          </div>

          <div className="elite-navbar-actions">
            <button
              type="button"
              className="elite-theme-btn"
              onClick={toggleMode}
              aria-label="Toggle light and dark mode"
            >
              {mode === "light" ? <FiMoon /> : <FiSun />}
              <span>{mode === "light" ? "Dark" : "Light"}</span>
            </button>

            <Button
              as={Link}
              to={adminCta}
              variant="outline-light"
              className={`elite-admin-btn${
                location.pathname === "/dashboard" ||
                location.pathname === "/admin/login"
                  ? " is-active"
                  : ""
              }`}
              onClick={closeMenu}
            >
              <FiShield />
              <span>Admin</span>
            </Button>

            {isAuthenticated ? (
              <button
                type="button"
                className="elite-logout-btn"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            ) : null}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
