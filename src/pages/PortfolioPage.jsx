import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { profileData } from "../content/profileData";
import { usePublicProjects } from "../hooks/useProjects";
import { resolveMediaUrl } from "../utils/mediaUrl";
import "../styles/pages.css";

const STATS = [
  { value: "3+",   label: "Years Building",  sub: "Full-stack" },
  { value: "15+",  label: "Apps Shipped",    sub: "End-to-end" },
  { value: "31",   label: "Technologies",    sub: "In active use" },
  { value: "100%", label: "Remote",          sub: "International ready" },
];

export const PortfolioPage = () => {
  const { data, isLoading, isError } = usePublicProjects();

  const dbProjects   = data ?? [];
  const staticBuilds = profileData.projects ?? [];

  return (
    <div className="pp-page">

      {/* ── Hero ── */}
      <section className="pp-hero">
        <div className="pp-hero-inner">
          <p className="pp-hero-eyebrow">Selected Work</p>
          <h1 className="pp-hero-title">Portfolio</h1>
          <p className="pp-hero-sub">
            Technical delivery across MERN stack applications, real-time systems, payment platforms,
            and secure APIs. Every project shipped to a real production environment.
          </p>
          <div className="pp-hero-actions">
            <Button as={Link} to="/projects" className="pp-btn pp-btn--primary btn">All Projects</Button>
            <Button as={Link} to="/contact" className="pp-btn pp-btn--outline btn">Hire Me</Button>
          </div>
          <div className="pp-hero-chips">
            <span className="pp-hero-chip">React 19</span>
            <span className="pp-hero-chip">Node.js</span>
            <span className="pp-hero-chip">MongoDB</span>
            <span className="pp-hero-chip">REST APIs</span>
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

      {/* ── DB Projects ── */}
      <section className="pp-section pp-section--alt">
        <Container>
          <div className="pp-section-header">
            <p className="pp-section-eyebrow">Featured Projects</p>
            <h2 className="pp-section-title">Production deliveries</h2>
            <p className="pp-section-sub">
              Full-stack systems built and deployed — from initial architecture to live environment.
            </p>
          </div>

          {isLoading && (
            <div className="pp-loading" style={{ justifyContent: "center" }}>
              <span className="pp-spinner" /> Loading projects…
            </div>
          )}

          {isError && (
            <div className="pp-empty">
              <div className="pp-empty-icon">⚠️</div>
              <p className="pp-empty-title">Failed to load projects</p>
              <p className="pp-empty-sub">Please refresh the page to try again.</p>
            </div>
          )}

          {!isLoading && !isError && dbProjects.length > 0 && (
            <Row className="g-4">
              {dbProjects.map((proj) => {
                const images = proj.imageUrls?.filter(Boolean) ?? [];
                const thumb  = images[0] ?? proj.coverImageUrl ?? null;
                const tags   = proj.tags ?? proj.techStack ?? [];
                return (
                  <Col sm={6} lg={4} key={proj._id}>
                    <div className="pp-proj-card">
                      <div className="pp-proj-thumb">
                        {thumb ? (
                          <img src={resolveMediaUrl(thumb)} alt={proj.title} />
                        ) : (
                          <div className="pp-proj-thumb-empty">
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5"/>
                              <polyline points="21 15 16 10 5 21"/>
                            </svg>
                          </div>
                        )}
                        {proj.featured && <span className="pp-proj-feat-badge">⭐ Featured</span>}
                        {proj.category && <span className="pp-proj-cat-badge">{proj.category}</span>}
                      </div>
                      <div className="pp-proj-body">
                        <h3 className="pp-proj-title">{proj.title}</h3>
                        <p className="pp-proj-summary">{proj.summary || proj.description}</p>
                        {tags.length > 0 && (
                          <div className="pp-proj-tags">
                            {tags.slice(0, 5).map((t) => (
                              <span key={t} className="pp-proj-tag">{t}</span>
                            ))}
                          </div>
                        )}
                        <div className="pp-proj-links">
                          {proj.liveUrl && (
                            <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="pp-proj-link">
                              Live ↗
                            </a>
                          )}
                          {proj.repoUrl && (
                            <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="pp-proj-link">
                              GitHub ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}

          {!isLoading && !isError && dbProjects.length === 0 && (
            <div className="pp-empty">
              <div className="pp-empty-icon">📦</div>
              <p className="pp-empty-title">Projects loading</p>
              <p className="pp-empty-sub">
                Featured projects will appear here once uploaded via the admin CMS.
                In the meantime, explore the active builds section below.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* ── Active Builds ── */}
      {staticBuilds.length > 0 && (
        <section className="pp-section">
          <Container>
            <div className="pp-section-header">
              <p className="pp-section-eyebrow">Active Builds</p>
              <h2 className="pp-section-title">Currently in development</h2>
              <p className="pp-section-sub">
                Work-in-progress systems that demonstrate current engineering focus areas.
              </p>
            </div>
            <Row className="g-3">
              {staticBuilds.map((build) => (
                <Col sm={6} lg={4} key={build.title}>
                  <div className="pp-card pp-card--hoverable" style={{
                    borderTop: "3px solid #14b8a6",
                    height: "100%",
                    padding: "1.25rem 1.2rem",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.7rem" }}>
                      <span style={{
                        display: "inline-block",
                        width: 8, height: 8, borderRadius: "50%",
                        background: "#22c55e",
                        boxShadow: "0 0 0 2.5px rgba(34,197,94,0.25)",
                        animation: "ppPulse 2s ease-in-out infinite",
                        flexShrink: 0,
                      }} />
                      <span style={{ color: "#22c55e", fontSize: "0.72rem", fontWeight: 800 }}>
                        {build.status ?? "In Progress"}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 0.55rem", color: "var(--text-main)", fontWeight: 850, fontSize: "0.96rem" }}>
                      {build.title}
                    </p>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.38rem" }}>
                      {(build.points ?? []).map((pt) => (
                        <li key={pt} style={{
                          position: "relative",
                          paddingLeft: "1rem",
                          color: "var(--text-muted)",
                          fontSize: "0.8rem",
                          lineHeight: 1.55,
                        }}>
                          <span style={{
                            position: "absolute", left: 0, top: "0.45em",
                            width: 5, height: 5, borderRadius: "50%",
                            background: "#14b8a6", display: "block",
                          }} />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* ── Achievements ── */}
      <section className="pp-section pp-section--alt">
        <Container>
          <Row className="g-4 align-items-start">
            <Col lg={4}>
              <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
                <p className="pp-section-eyebrow">Outcomes</p>
                <h2 className="pp-section-title">What I've delivered</h2>
                <p className="pp-section-sub" style={{ textAlign: "left" }}>
                  Tangible results across engineering projects.
                </p>
              </div>
            </Col>
            <Col lg={8}>
              <ul className="pp-achievement-list" style={{ margin: 0 }}>
                {profileData.achievements.map((a) => (
                  <li key={a} className="pp-achievement-item">
                    <span className="pp-achievement-dot" />
                    <span className="pp-achievement-text">{a}</span>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Tech Stack ── */}
      <section className="pp-section">
        <Container>
          <div className="pp-section-header">
            <p className="pp-section-eyebrow">Technology</p>
            <h2 className="pp-section-title">Full technology stack</h2>
            <p className="pp-section-sub">
              Every tool used across the 15+ applications I've shipped to production.
            </p>
          </div>
          <div className="pp-tech-grid" style={{ justifyContent: "center" }}>
            {profileData.technologyStack.map((t) => (
              <span key={t} className="pp-tech-badge">{t}</span>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="pp-cta-section">
        <Container>
          <div className="pp-cta-inner">
            <p className="pp-cta-eyebrow">Available now</p>
            <h2 className="pp-cta-title">Ready to build your next product?</h2>
            <p className="pp-cta-sub">
              From MVP to production-grade systems — available for full-time roles, contracts,
              and long-term remote partnerships.
            </p>
            <div className="pp-cta-actions">
              <Button as={Link} to="/contact" className="pp-cta-btn-white btn">Contact Me</Button>
              <Button as={Link} to="/services" className="pp-cta-btn-ghost btn">View Services</Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
