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
    desc: "System design from scratch, microservices, scalability planning, API design, database architecture, MVC patterns, modular code structure.",
  },
  {
    accent: "blue",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: "API Development & Security",
    desc: "RESTful API design, JWT token authentication and management, secure endpoints, rate limiting, error handling, data validation.",
  },
  {
    accent: "green",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
      </svg>
    ),
    title: "Payment Processing",
    desc: "Stripe API integration, payment workflows, transaction handling, secure payment processing, PCI compliance awareness, webhook management.",
  },
  {
    accent: "orange",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: "Real-Time Systems",
    desc: "WebSockets, event-driven architecture, real-time data synchronisation, live updates, instant notifications.",
  },
  {
    accent: "purple",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: "Frontend Development",
    desc: "React.js, TypeScript, JavaScript ES6+, React Query, Redux, responsive design, production-grade user interfaces.",
  },
  {
    accent: "teal",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    ),
    title: "Backend Development",
    desc: "Node.js, Express.js, RESTful APIs, API design, MVC architecture, middleware design, modular code structure.",
  },
  {
    accent: "blue",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    title: "Database Design & Management",
    desc: "MongoDB, MongoDB Atlas, schema design, query optimisation, data modelling, transaction management, data consistency.",
  },
  {
    accent: "green",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: "DevOps & Deployment",
    desc: "Docker, Docker Compose, Redis, Git, GitHub, Linux environment management, CI/CD concepts, performance optimisation, debugging, production problem-solving.",
  },
];

const STATS = [
  { value: "3+",   label: "Years Experience", sub: "Full-stack" },
  { value: "15+",  label: "Apps Shipped",     sub: "End-to-end" },
  { value: "8",    label: "Disciplines",      sub: "Cross-domain" },
  { value: "100%", label: "Remote Ready",     sub: "International" },
];

const PRINCIPLES = [
  { label: "Security-First",    desc: "JWT authentication, secure endpoints, data validation, and rate limiting are built into every API — not bolted on at the end." },
  { label: "Architecture-First", desc: "Database schemas, API surfaces, and module boundaries are designed before the first line of code — never retrofitted later." },
  { label: "Production-Grade",  desc: "Docker containerisation, health checks, graceful shutdown, and environment separation ship with every deployment." },
  { label: "Self-Directed",     desc: "Three years of fully remote, async engineering — I scope accurately, communicate proactively, and deliver on schedule." },
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
          End-to-end engineering across secure APIs, real-time systems, payment processing, and
          production-grade frontend interfaces — using React.js, Node.js, MongoDB, Stripe, and Docker.
          Security, scalability, and clean architecture are the baseline, not an add-on.
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
            From blank canvas to production deploy — I own architecture, implementation, testing,
            and delivery across all eight disciplines with no handoff gaps.
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
              Security, performance, and scalability are foundational decisions made at the design
              phase — not patches applied at launch. I write clean, maintainable code following
              industry standards, design patterns, and best practices with comprehensive error handling.
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
          <p className="pp-section-sub">A battle-tested stack refined over 3+ years of real-world production projects — React.js, Node.js, MongoDB, Stripe, WebSockets, Docker, and more.</p>
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
