import { useEffect } from "react";

import { Button, Col, Container, Row } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { getTestimonialsRequest } from "../api/testimonialApi";
import { profileData } from "../content/profileData";
import { usePublicProjects } from "../hooks/useProjects";
import { useMediaStore } from "../store/mediaStore";
import { useProfileStore } from "../store/profileStore";
import { resolveMediaUrl } from "../utils/mediaUrl";
import "../styles/home.css";

/* ───────────────────── SVG Icons ───────────────────── */
const IconArch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconCard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);
const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
const IconMon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);
const IconSrv = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
    <rect x="2" y="3" width="20" height="7" rx="1" />
    <rect x="2" y="14" width="20" height="7" rx="1" />
    <path d="M6 7h.01M6 18h.01" />
  </svg>
);
const IconDb = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
  </svg>
);
const IconProd = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IconGh = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
const IconLi = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 7L2 7" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/* ───────────────────── Static Data ─────────────────── */

const STATS = [
  { value: "3+",   label: "Years Experience",  sub: "Hands-on building" },
  { value: "15+",  label: "Apps Built",         sub: "Production-grade" },
  { value: "8",    label: "Core Disciplines",   sub: "Full-spectrum dev" },
  { value: "100%", label: "Remote Capable",     sub: "Any timezone" },
];

const QUICK_ROLES = [
  "Full Stack Developer",
  "React Developer",
  "Node.js Developer",
  "MongoDB Developer",
  "REST API Developer",
];

const SERVICES = [
  { Icon: IconArch, title: "System Architecture",        desc: "Scalable systems from scratch — API design, database architecture, MVC patterns, modular structure.",                      accent: "teal"   },
  { Icon: IconLock, title: "API Development & Security", desc: "RESTful API design, JWT token authentication, secure endpoints, rate limiting, data validation, error handling.",           accent: "blue"   },
  { Icon: IconCard, title: "Payment Processing",         desc: "Stripe API integration, payment workflows, transaction handling, webhook management, PCI compliance awareness.",            accent: "green"  },
  { Icon: IconBolt, title: "Real-Time Systems",          desc: "WebSockets, event-driven architecture, real-time data synchronization, live updates, instant notifications.",               accent: "orange" },
  { Icon: IconMon,  title: "Frontend Development",       desc: "React.js, TypeScript, JavaScript ES6+, React Query, Redux, responsive design, production-grade user interfaces.",          accent: "purple" },
  { Icon: IconSrv,  title: "Backend Development",        desc: "Node.js, Express.js, RESTful APIs, MVC architecture, middleware design, modular code structure.",                          accent: "blue"   },
  { Icon: IconDb,   title: "Database Design & Management", desc: "MongoDB, MongoDB Atlas, schema design, query optimization, data modeling, transaction management, data consistency.",                              accent: "teal"   },
  { Icon: IconProd, title: "DevOps & Deployment",        desc: "Docker, Docker Compose, Redis, Git, GitHub, Linux environment management, CI/CD concepts, performance optimization, debugging, production problem-solving.", accent: "green"  },
];

const SKILL_CATEGORIES = [
  {
    icon: "⚛",
    label: "Frontend",
    accent: "blue",
    skills: ["React.js", "TypeScript", "JavaScript ES6+", "React Query", "Redux", "Responsive Design"],
  },
  {
    icon: "⚙",
    label: "Backend",
    accent: "green",
    skills: ["Node.js", "Express.js", "RESTful APIs", "JWT Auth", "MVC Architecture", "WebSockets"],
  },
  {
    icon: "🗄",
    label: "Database",
    accent: "teal",
    skills: ["MongoDB", "MongoDB Atlas", "Schema Design", "Query Optimization", "Data Modeling", "Transactions"],
  },
  {
    icon: "🛠",
    label: "Tools & DevOps",
    accent: "purple",
    skills: ["Docker", "Docker Compose", "Redis", "Git", "GitHub", "Linux"],
  },
];

/* ───────────────────── Component ─────────────────── */

export const HomePage = () => {
  const loadProfile   = useProfileStore((s) => s.load);
  const profileLoaded = useProfileStore((s) => s.loaded);
  const getFullName   = useProfileStore((s) => s.getFullName);
  const getHeadline   = useProfileStore((s) => s.getHeadline);

  const media       = useMediaStore((s) => s.media);
  const mediaLoaded = useMediaStore((s) => s.loaded);
  const loadMedia   = useMediaStore((s) => s.load);

  const projectsQuery = usePublicProjects();
  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonialsRequest,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!profileLoaded) loadProfile();
    if (!mediaLoaded) loadMedia();
  }, [profileLoaded, loadProfile, mediaLoaded, loadMedia]);

  const fullName        = getFullName();
  const headline        = getHeadline();
  const allProjects     = projectsQuery.data || [];
  const featuredProjs   = allProjects.filter((p) => p.featured).slice(0, 3);
  const displayProjects = featuredProjs.length > 0 ? featuredProjs : allProjects.slice(0, 3);

  return (
    <div className="home-page">

      {/* ══════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════ */}
      <section className="home-hero">
        <div className="home-hero-shell">

          {/* Left: copy */}
          <div className="home-hero-copy">
            <p className="home-hero-eyebrow">Full Stack Developer — Available Now</p>
            <h1 className="home-hero-title">{fullName}</h1>
            <p className="home-hero-role">{headline}</p>

            <p className="home-hero-summary">
              3+ years designing and building scalable web applications from the ground up —
              expert in API security, Stripe payment processing, real-time WebSocket systems,
              and full-stack architectures using React.js, Node.js, MongoDB, and Docker.
            </p>

            <div className="home-hero-signals">
              {profileData.recruiterSignals.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>

            <div className="home-hero-actions">
              <Button as={Link} to="/projects" className="home-hero-primary">
                View Projects
              </Button>
              <Button as={Link} to="/media" className="home-hero-secondary">
                View Profile
              </Button>
              <Button as={Link} to="/contact" className="home-hero-secondary">
                Hire Me
              </Button>
            </div>

            <div className="home-hero-socials">
              <a href={profileData.github} target="_blank" rel="noreferrer" className="home-social-link" aria-label="GitHub">
                <IconGh /> GitHub
              </a>
              <a href={profileData.linkedin} target="_blank" rel="noreferrer" className="home-social-link" aria-label="LinkedIn">
                <IconLi /> LinkedIn
              </a>
              <a href={`mailto:${profileData.email}`} className="home-social-link" aria-label="Email">
                <IconMail /> {profileData.email}
              </a>
            </div>
          </div>

          {/* Right: premium profile card */}
          <div className="home-hero-visual" aria-label={`${fullName} — professional profile`}>
            <div className="hpc-card">

              <div className="hpc-card-top">
                <span className="hpc-card-label">Professional Profile</span>
                <span className="hpc-online-pill">
                  <span className="hpc-online-dot" />
                  Open to opportunities
                </span>
              </div>

              <div className="hpc-photo-wrap">
                <div className="hpc-photo-ring">
                  {media.profilePhoto ? (
                    <img src={media.profilePhoto} alt={fullName} className="hpc-photo-img" />
                  ) : (
                    <div className="hpc-photo-empty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="44" height="44">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="hpc-chips">
                <span className="hpc-chip hpc-chip--green">✓ Open To Work</span>
                <span className="hpc-chip hpc-chip--blue">⟳ Remote Friendly</span>
              </div>

              <div className="hpc-identity">
                <h3 className="hpc-name">{fullName}</h3>
                <p className="hpc-title">Full Stack Developer</p>
                <p className="hpc-subtitle">
                  <IconPin /> {profileData.location}
                </p>
              </div>

              <div className="hpc-divider" />

              <ul className="hpc-roles">
                {QUICK_ROLES.map((role) => (
                  <li key={role} className="hpc-role-item">
                    <span className="hpc-role-dot" />
                    {role}
                  </li>
                ))}
              </ul>

              <div className="hpc-divider" />

              <div className="hpc-actions">
                <Button as={Link} to="/projects" className="hpc-btn hpc-btn--primary">
                  View Portfolio
                </Button>
                {media.cvPdf ? (
                  <Button as="a" href={media.cvPdf} target="_blank" rel="noreferrer" className="hpc-btn hpc-btn--outline">
                    ↓ Download CV
                  </Button>
                ) : (
                  <Button as={Link} to="/resume" className="hpc-btn hpc-btn--outline">
                    View Resume
                  </Button>
                )}
                {media.resumePdf ? (
                  <Button as="a" href={media.resumePdf} target="_blank" rel="noreferrer" className="hpc-btn hpc-btn--outline">
                    ↓ Resume
                  </Button>
                ) : (
                  <Button as={Link} to="/resume" className="hpc-btn hpc-btn--outline">
                    Resume
                  </Button>
                )}
                <Button as={Link} to="/contact" className="hpc-btn hpc-btn--ghost">
                  Contact Me
                </Button>
              </div>

              <div className="hpc-socials">
                <a href={profileData.github} target="_blank" rel="noreferrer" className="hpc-social" aria-label="GitHub">
                  <IconGh />
                </a>
                <a href={profileData.linkedin} target="_blank" rel="noreferrer" className="hpc-social" aria-label="LinkedIn">
                  <IconLi />
                </a>
                <a href={`mailto:${profileData.email}`} className="hpc-social" aria-label="Email">
                  <IconMail />
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. CREDENTIALS STATS STRIP
      ══════════════════════════════════════════════════════ */}
      <section className="home-stats-strip" aria-label="Key credentials">
        <div className="home-stats-shell">
          {STATS.map((stat) => (
            <div key={stat.label} className="home-stat-item">
              <span className="home-stat-value">{stat.value}</span>
              <span className="home-stat-label">{stat.label}</span>
              <span className="home-stat-sub">{stat.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. RECRUITER SNAPSHOT
      ══════════════════════════════════════════════════════ */}
      <section className="home-recruiter-snapshot" aria-labelledby="home-recruiter-snapshot-title">
        <div className="home-snapshot-shell">
          <div className="home-snapshot-header">
            <p className="home-snapshot-eyebrow">Companies, Recruiters &amp; Clients</p>
            <h2 id="home-recruiter-snapshot-title">Recruiter Snapshot</h2>
            <p>
              A concise hiring profile for international teams, relocation discussions,
              sponsorship review, and project-based opportunities.
            </p>
          </div>
          <div className="home-snapshot-grid">
            {profileData.recruiterSummary.map((item) => (
              <div className="home-snapshot-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
            <div className="home-snapshot-card">
              <span>Experience</span>
              <strong>3+ Years</strong>
            </div>
            <div className="home-snapshot-card">
              <span>Projects Built</span>
              <strong>15+ Web Apps</strong>
            </div>
            <div className="home-snapshot-card">
              <span>Mobility</span>
              <strong>Relocation Available</strong>
            </div>
          </div>
          <div className="home-snapshot-notes">
            {profileData.recruiterSnapshotNotes
              .filter((note) => note !== "Relocation Available" && note !== "Remote | Hybrid | On-site")
              .map((note) => (
                <span key={note}>{note}</span>
              ))}
          </div>
          <div className="home-snapshot-actions">
            <Button as={Link} to="/resume" className="home-snapshot-primary">
              View Resume
            </Button>
            <Button as={Link} to="/contact" className="home-snapshot-secondary">
              Start Conversation
            </Button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. CORE SERVICES — what I offer
      ══════════════════════════════════════════════════════ */}
      <section className="home-services-section">
        <Container fluid className="home-services-shell">
          <div className="home-section-header">
            <span className="home-section-eyebrow">What I Offer</span>
            <h2 className="home-section-title">Core Services</h2>
            <p className="home-section-sub">
              End-to-end development across the full stack — from architecting databases
              to deploying secure, production-ready applications companies can rely on.
            </p>
          </div>
          <div className="home-services-grid">
            {SERVICES.map(({ Icon, title, desc, accent }) => (
              <div key={title} className={`home-svc-card home-svc-card--${accent}`}>
                <div className="home-svc-icon-wrap">
                  <Icon />
                </div>
                <h4 className="home-svc-title">{title}</h4>
                <p className="home-svc-desc">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. TECHNOLOGY STACK
      ══════════════════════════════════════════════════════ */}
      <section className="home-skills-section">
        <Container fluid className="home-skills-shell">
          <div className="home-section-header">
            <span className="home-section-eyebrow">Technical Expertise</span>
            <h2 className="home-section-title">Technology Stack</h2>
            <p className="home-section-sub">
              Full-stack expertise spanning frontend interfaces, backend APIs, databases,
              and production tooling.
            </p>
          </div>
          <div className="home-skills-grid">
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.label} className={`home-skill-card home-skill-card--${cat.accent}`}>
                <div className="home-skill-card-hdr">
                  <span className="home-skill-icon" aria-hidden="true">{cat.icon}</span>
                  <h4 className="home-skill-label">{cat.label}</h4>
                </div>
                <div className="home-skill-badges">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="home-skill-badge">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. FEATURED PROJECTS (DB-driven)
      ══════════════════════════════════════════════════════ */}
      {displayProjects.length > 0 && (
        <section className="home-projects-section">
          <Container fluid className="home-projects-shell">
            <div className="home-section-header">
              <span className="home-section-eyebrow">Portfolio Showcase</span>
              <h2 className="home-section-title">
                {featuredProjs.length > 0 ? "Featured Projects" : "Recent Projects"}
              </h2>
              <p className="home-section-sub">
                Production-grade applications built from the ground up — architecture,
                security, and scalability as priorities.
              </p>
            </div>
            <Row className="g-3">
              {displayProjects.map((project) => {
                const thumb = (project.imageUrls || [])[0] || project.coverImageUrl || null;
                return (
                  <Col key={project._id} xs={12} md={6} lg={4}>
                    <div className="home-proj-card">
                      <div className="home-proj-thumb">
                        {thumb ? (
                          <img src={resolveMediaUrl(thumb)} alt={project.title} className="home-proj-thumb-img" />
                        ) : (
                          <div className="home-proj-thumb-empty">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
                              <rect x="3" y="5" width="18" height="14" rx="2" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </div>
                        )}
                        {project.featured && <span className="home-proj-feat-badge">⭐ Featured</span>}
                        {project.category && <span className="home-proj-cat-badge">{project.category}</span>}
                      </div>
                      <div className="home-proj-body">
                        <h4 className="home-proj-title">{project.title}</h4>
                        <p className="home-proj-summary">{project.summary}</p>
                        {(project.techStack || []).length > 0 && (
                          <div className="home-proj-tags">
                            {project.techStack.slice(0, 4).map((t) => (
                              <span key={t} className="home-proj-tag">{t}</span>
                            ))}
                          </div>
                        )}
                        <div className="home-proj-links">
                          {project.repoUrl && (
                            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="home-proj-link">
                              GitHub ↗
                            </a>
                          )}
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="home-proj-link">
                              Live Demo ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
            <div className="home-proj-cta">
              <Button as={Link} to="/projects" className="home-snapshot-primary">
                View All Projects →
              </Button>
            </div>
          </Container>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          7. ACTIVE BUILDS (static — from profileData)
      ══════════════════════════════════════════════════════ */}
      <section className="home-builds-section">
        <Container fluid className="home-builds-shell">
          <div className="home-section-header">
            <span className="home-section-eyebrow">Currently Building</span>
            <h2 className="home-section-title">Active Projects</h2>
            <p className="home-section-sub">
              Production systems in active development — demonstrating architectural depth
              and full-cycle delivery capability.
            </p>
          </div>
          <div className="home-builds-grid">
            {profileData.projects.map((proj) => (
              <div key={proj.title} className="home-build-card">
                <div className="home-build-card-head">
                  <span className="home-build-status">⬤ {proj.status}</span>
                  <h4 className="home-build-title">{proj.title}</h4>
                </div>
                <ul className="home-build-points">
                  {proj.points.slice(0, 4).map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          8. WORK EXPERIENCE + EDUCATION
      ══════════════════════════════════════════════════════ */}
      <section className="home-exp-section">
        <Container fluid className="home-exp-shell">
          <div className="home-section-header home-section-header--left">
            <span className="home-section-eyebrow">Work History</span>
            <h2 className="home-section-title">Experience</h2>
          </div>

          <div className="home-exp-timeline">
            {profileData.workExperience.map((exp, i) => (
              <div key={i} className="home-exp-item">
                <div className="home-exp-dot" />
                <div className="home-exp-content">
                  <div className="home-exp-header">
                    <div>
                      <h4 className="home-exp-role">{exp.role}</h4>
                      <p className="home-exp-company">{exp.company}</p>
                    </div>
                    {exp.period && (
                      <span className="home-exp-period">{exp.period}</span>
                    )}
                  </div>
                  <ul className="home-exp-highlights">
                    {exp.highlights.slice(0, 5).map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="home-edu-strip">
            <p className="home-edu-eyebrow">Education</p>
            {profileData.education.map((edu) => (
              <div key={edu.institution} className="home-edu-card">
                <div className="home-edu-icon">🎓</div>
                <div>
                  <p className="home-edu-qual">{edu.qualification}</p>
                  <p className="home-edu-inst">{edu.institution}</p>
                  {edu.period && <p className="home-edu-period">{edu.period}</p>}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════
          9. TESTIMONIALS (conditional)
      ══════════════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="home-testi-section">
          <Container fluid className="home-testi-shell">
            <div className="home-section-header">
              <span className="home-section-eyebrow">Social Proof</span>
              <h2 className="home-section-title">What People Say</h2>
            </div>
            <Row className="g-3">
              {testimonials.slice(0, 3).map((t) => (
                <Col key={t._id} xs={12} md={6} lg={4}>
                  <div className="home-testi-card">
                    <p className="home-testi-quote">"{t.quote}"</p>
                    <div className="home-testi-author">
                      <span className="home-testi-name">{t.name}</span>
                      {t.role && (
                        <span className="home-testi-role">{t.role}{t.company ? `, ${t.company}` : ""}</span>
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          10. HIRE-ME CLOSING CTA
      ══════════════════════════════════════════════════════ */}
      <section className="home-hire-cta">
        <Container>
          <div className="home-hire-inner">
            <span className="home-section-eyebrow">Let's Work Together</span>
            <h2 className="home-hire-title">Ready to Build Something Great?</h2>
            <p className="home-hire-sub">
              Available for full-time roles and contract projects.
              International opportunities and relocation welcome.
            </p>
            <div className="home-hire-actions">
              <Button as={Link} to="/contact" className="home-hero-primary">
                Get In Touch
              </Button>
              {media.cvPdf && (
                <Button as="a" href={media.cvPdf} target="_blank" rel="noreferrer" className="home-hero-secondary">
                  ↓ Download CV
                </Button>
              )}
              {media.resumePdf && (
                <Button as="a" href={media.resumePdf} target="_blank" rel="noreferrer" className="home-hero-secondary">
                  ↓ Download Resume
                </Button>
              )}
            </div>

            <div className="home-hire-contact-bar">
              <a href={`mailto:${profileData.email}`} className="home-hire-contact-link">
                <IconMail /> {profileData.email}
              </a>
              <a href={profileData.github} target="_blank" rel="noreferrer" className="home-hire-contact-link">
                <IconGh /> github.com/trubit
              </a>
              <a href={profileData.linkedin} target="_blank" rel="noreferrer" className="home-hire-contact-link">
                <IconLi /> linkedin.com/in/trust-ezika
              </a>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
};
