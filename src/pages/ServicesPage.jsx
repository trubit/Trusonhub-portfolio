import { useEffect } from "react";

import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useProfileStore } from "../store/profileStore";
import "../styles/pages.css";

const SERVICES = [
  {
    accent: "teal",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: "System Architecture",
    desc: "Design scalable, distributed back-end systems with service separation, queues, and resilience built in from day one.",
  },
  {
    accent: "blue",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: "API Security & Auth",
    desc: "JWT, OAuth2, RBAC, and rate-limiting hardened into every endpoint. Secure by default, not an afterthought.",
  },
  {
    accent: "green",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
      </svg>
    ),
    title: "Payment Integration",
    desc: "Stripe, Paystack, and webhook-driven billing flows for SaaS platforms, marketplaces, and subscription products.",
  },
  {
    accent: "orange",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: "Real-Time Systems",
    desc: "WebSocket, Socket.IO, and event-driven pipelines for live dashboards, collaborative apps, and push notifications.",
  },
  {
    accent: "purple",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: "Frontend Development",
    desc: "React 19, responsive layouts, accessible UI components, and performance-optimised SPA/MPA applications.",
  },
  {
    accent: "teal",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    ),
    title: "Back-End Engineering",
    desc: "Node.js / Express APIs with clean layered architecture: controllers, services, repositories, and typed contracts.",
  },
  {
    accent: "blue",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    title: "Database Design",
    desc: "MongoDB schema design, indexing strategies, GridFS binary storage, and query optimisation for production loads.",
  },
  {
    accent: "green",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: "Production & DevOps",
    desc: "Docker, environment separation, health checks, graceful shutdown, and structured logging for observable deploys.",
  },
];

const STATS = [
  { value: "3+",   label: "Years Experience", sub: "Full-stack" },
  { value: "15+",  label: "Apps Shipped",     sub: "End-to-end" },
  { value: "8",    label: "Disciplines",      sub: "Cross-domain" },
  { value: "100%", label: "Remote Ready",     sub: "International" },
];

const PRINCIPLES = [
  { label: "Security-First",    desc: "Auth, validation, and OWASP hardening built into every API contract." },
  { label: "Architecture-First", desc: "Systems are designed to scale before they're coded — not retrofitted later." },
  { label: "Production-Grade",  desc: "Logging, health checks, and graceful shutdown ship with every deployment." },
  { label: "Self-Directed",     desc: "100% async remote. I scope accurately, communicate clearly, and deliver." },
];

export const ServicesPage = () => {
  const getSkills = useProfileStore((s) => s.getSkills);
  const loaded = useProfileStore((s) => s.loaded);
  const load = useProfileStore((s) => s.load);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const skills = getSkills();

  return (
  <div className="pp-page">

    {/* ── Hero ── */}
    <section className="pp-hero">
      <div className="pp-hero-inner">
        <p className="pp-hero-eyebrow">What I Build</p>
        <h1 className="pp-hero-title">Core Services</h1>
        <p className="pp-hero-sub">
          End-to-end engineering across back-end systems, secure APIs, real-time data layers, and
          production-grade front-end interfaces. Every engagement is delivered with security,
          scalability, and clean architecture as a baseline — not an add-on.
        </p>
        <div className="pp-hero-actions">
          <Button as={Link} to="/contact" className="pp-btn pp-btn--primary btn">Hire Me</Button>
          <Button as={Link} to="/projects" className="pp-btn pp-btn--outline btn">View Projects</Button>
        </div>
        <div className="pp-hero-chips">
          <span className="pp-hero-chip">Available for Remote Work</span>
          <span className="pp-hero-chip">Full-Stack Developer</span>
          <span className="pp-hero-chip">Port Harcourt, Nigeria</span>
        </div>
      </div>
    </section>

    {/* ── Stats ── */}
    <section className="pp-section" style={{ paddingTop: "1.5rem", paddingBottom: 0 }}>
      <Container>
        <div className="pp-stat-strip">
          {STATS.map((s) => (
            <div key={s.label} className="pp-stat-item">
              <span className="pp-stat-value">{s.value}</span>
              <span className="pp-stat-label">{s.label}</span>
              <span className="pp-stat-sub">{s.sub}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>

    {/* ── Services grid ── */}
    <section className="pp-section pp-section--alt">
      <Container>
        <div className="pp-section-header">
          <p className="pp-section-eyebrow">Specialisations</p>
          <h2 className="pp-section-title">Eight disciplines, one developer</h2>
          <p className="pp-section-sub">
            From architecture whiteboard to production deploy — I handle the full engineering
            lifecycle so your team ships faster with fewer handoffs.
          </p>
        </div>
        <div className="pp-svc-grid">
          {SERVICES.map((s) => (
            <div key={s.title} className={`pp-svc-card pp-svc-card--${s.accent}`}>
              <div className="pp-svc-icon">{s.icon}</div>
              <p className="pp-svc-title">{s.title}</p>
              <p className="pp-svc-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>

    {/* ── Engineering principles ── */}
    <section className="pp-section">
      <Container>
        <Row className="g-4 align-items-center">
          <Col md={6}>
            <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
              <p className="pp-section-eyebrow">How I Work</p>
              <h2 className="pp-section-title">Engineering principles that matter</h2>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.72 }}>
              I don't treat security, performance, or scalability as afterthoughts. They're
              foundational decisions made in the design phase, not patches applied at launch.
              Every project ships with clean documentation and a handoff your team can own.
            </p>
          </Col>
          <Col md={6}>
            <Row className="g-3">
              {PRINCIPLES.map((p) => (
                <Col xs={12} sm={6} key={p.label}>
                  <div className="pp-card pp-card--hoverable" style={{ padding: "1.05rem 1.1rem" }}>
                    <p style={{ margin: "0 0 0.32rem", color: "var(--text-main)", fontWeight: 850, fontSize: "0.9rem" }}>
                      {p.label}
                    </p>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: 1.6 }}>
                      {p.desc}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>

    {/* ── Tech stack ── */}
    <section className="pp-section pp-section--alt">
      <Container>
        <div className="pp-section-header">
          <p className="pp-section-eyebrow">Technology</p>
          <h2 className="pp-section-title">Tools of the trade</h2>
          <p className="pp-section-sub">A battle-tested stack refined over 3+ years of real-world projects.</p>
        </div>
        <div className="pp-tech-grid" style={{ justifyContent: "center" }}>
          {skills.map((tech) => (
            <span key={tech} className="pp-tech-badge">{tech}</span>
          ))}
        </div>
      </Container>
    </section>

    {/* ── CTA ── */}
    <section className="pp-cta-section">
      <Container>
        <div className="pp-cta-inner">
          <p className="pp-cta-eyebrow">Ready to build?</p>
          <h2 className="pp-cta-title">Let's discuss your project</h2>
          <p className="pp-cta-sub">
            Available for full-time roles, contract engagements, and long-term product partnerships.
            International remote opportunities welcomed.
          </p>
          <div className="pp-cta-actions">
            <Button as={Link} to="/contact" className="pp-cta-btn-white btn">Contact Me</Button>
            <Button as={Link} to="/portfolio" className="pp-cta-btn-ghost btn">View Portfolio</Button>
          </div>
        </div>
      </Container>
    </section>
  </div>
  );
};
