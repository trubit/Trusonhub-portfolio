import { useEffect } from "react";

import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { profileData } from "../content/profileData";
import { useMediaStore } from "../store/mediaStore";
import { useProfileStore } from "../store/profileStore";
import { resolveMediaUrl } from "../utils/mediaUrl";
import "../styles/pages.css";

const PRINCIPLES = [
  {
    label: "Security-First",
    desc: "Auth, validation, and OWASP hardening are foundational decisions — not bolted on at the end.",
  },
  {
    label: "Architecture-First",
    desc: "I design for scale before writing the first line of code, not after the codebase needs refactoring.",
  },
  {
    label: "Production-Grade Defaults",
    desc: "Logging, health checks, graceful shutdown, and environment separation come with every deployment.",
  },
  {
    label: "Autonomous & Async",
    desc: "Self-directed remote work. I scope accurately, communicate proactively, and deliver on schedule.",
  },
];

export const AboutPage = () => {
  const profilePhoto = useMediaStore((s) => s.media.profilePhoto);
  const mediaLoaded  = useMediaStore((s) => s.loaded);
  const loadMedia    = useMediaStore((s) => s.load);

  const getFullName    = useProfileStore((s) => s.getFullName);
  const getHeadline    = useProfileStore((s) => s.getHeadline);
  const getLocation    = useProfileStore((s) => s.getLocation);
  const getBio         = useProfileStore((s) => s.getBio);
  const getSkills      = useProfileStore((s) => s.getSkills);
  const profileLoaded  = useProfileStore((s) => s.loaded);
  const loadProfile    = useProfileStore((s) => s.load);

  useEffect(() => {
    if (!mediaLoaded) loadMedia();
    if (!profileLoaded) loadProfile();
  }, [mediaLoaded, loadMedia, profileLoaded, loadProfile]);

  const fullName = getFullName();
  const headline = getHeadline();
  const location = getLocation();
  const bio      = getBio();
  const skills   = getSkills();

  return (
    <div className="pp-page">

      {/* ── Hero ── */}
      <section className="pp-hero">
        <div className="pp-hero-inner">
          <div className="pp-hero-grid">
            <div>
              <p className="pp-hero-eyebrow">About Me</p>
              <h1 className="pp-hero-title">{fullName}</h1>
              <p className="pp-hero-sub">{headline}</p>
              <div className="pp-hero-actions">
                <Button as={Link} to="/contact" className="pp-btn pp-btn--primary btn">
                  Get In Touch
                </Button>
                <Button as={Link} to="/resume" className="pp-btn pp-btn--outline btn">
                  View Resume
                </Button>
              </div>
              <div className="pp-hero-chips" style={{ marginTop: "1.2rem" }}>
                <span className="pp-hero-chip">📍 {location}</span>
                <span className="pp-hero-chip">Remote Ready</span>
                <span className="pp-hero-chip">Open to Opportunities</span>
              </div>
            </div>

            {/* Profile card — hidden on mobile via CSS */}
            <div className="pp-hero-profile-card">
              <div className="pp-hero-photo">
                {profilePhoto ? (
                  <img src={resolveMediaUrl(profilePhoto)} alt={fullName} />
                ) : (
                  <div className="pp-hero-photo-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  </div>
                )}
              </div>
              <p className="pp-hero-card-name">{fullName}</p>
              <p className="pp-hero-card-role">Full Stack Developer</p>
              <div className="pp-hero-card-chips">
                <span className="pp-hero-chip" style={{ fontSize: "0.72rem" }}>Node.js</span>
                <span className="pp-hero-chip" style={{ fontSize: "0.72rem" }}>React</span>
                <span className="pp-hero-chip" style={{ fontSize: "0.72rem" }}>MongoDB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Professional Summary ── */}
      <section className="pp-section pp-section--alt">
        <Container>
          <Row className="g-4 align-items-start">
            <Col lg={5}>
              <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
                <p className="pp-section-eyebrow">Background</p>
                <h2 className="pp-section-title">Who I am</h2>
              </div>
            </Col>
            <Col lg={7}>
              <div className="pp-card" style={{ padding: "1.5rem 1.6rem" }}>
                <p style={{ margin: "0 0 0.9rem", color: "var(--text-muted)", fontSize: "0.93rem", lineHeight: 1.72 }}>
                  {bio}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginTop: "0.5rem" }}>
                  {profileData.recruiterSummary.map((item) => (
                    <span key={item.label} style={{
                      display: "inline-block", padding: "0.3rem 0.75rem", borderRadius: 999,
                      border: "1px solid var(--border-soft)", background: "var(--bg-soft)",
                      color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 700,
                    }}>
                      {item.label}: {item.value}
                    </span>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Principles ── */}
      <section className="pp-section">
        <Container>
          <div className="pp-section-header">
            <p className="pp-section-eyebrow">Approach</p>
            <h2 className="pp-section-title">How I work</h2>
            <p className="pp-section-sub">
              The principles I apply consistently across every engagement — from solo projects to
              cross-functional team collaborations.
            </p>
          </div>
          <Row className="g-3">
            {PRINCIPLES.map((p) => (
              <Col sm={6} lg={3} key={p.label}>
                <div className="pp-card pp-card--hoverable" style={{ height: "100%", padding: "1.2rem 1.1rem" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9, background: "rgba(20,184,166,0.12)",
                    border: "1px solid rgba(20,184,166,0.24)", display: "flex", alignItems: "center",
                    justifyContent: "center", marginBottom: "0.8rem",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p style={{ margin: "0 0 0.32rem", color: "var(--text-main)", fontWeight: 850, fontSize: "0.9rem" }}>{p.label}</p>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: 1.62 }}>{p.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── Core Skills ── */}
      <section className="pp-section pp-section--alt">
        <Container>
          <div className="pp-section-header">
            <p className="pp-section-eyebrow">Competencies</p>
            <h2 className="pp-section-title">Core skills</h2>
          </div>
          <div className="pp-tech-grid" style={{ justifyContent: "center" }}>
            {skills.map((skill) => (
              <span key={skill} className="pp-tech-badge">{skill}</span>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Work Experience ── */}
      <section className="pp-section">
        <Container>
          <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
            <p className="pp-section-eyebrow">Experience</p>
            <h2 className="pp-section-title">Work history</h2>
          </div>
          <div className="pp-timeline">
            {profileData.workExperience.map((job) => (
              <div key={job.role + job.company} className="pp-timeline-item">
                <div className="pp-timeline-dot" />
                <div className="pp-timeline-content">
                  <div className="pp-timeline-header">
                    <div>
                      <p className="pp-timeline-role">{job.role}</p>
                      <p className="pp-timeline-company">{job.company}</p>
                    </div>
                    <span className="pp-timeline-period">{job.period}</span>
                  </div>
                  <ul className="pp-timeline-list">
                    {job.highlights.map((h) => <li key={h}>{h}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Education ── */}
      {profileData.education?.length > 0 && (
        <section className="pp-section pp-section--alt">
          <Container>
            <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
              <p className="pp-section-eyebrow">Education</p>
              <h2 className="pp-section-title">Academic background</h2>
            </div>
            {profileData.education.map((edu) => (
              <div key={edu.institution} className="pp-card" style={{ maxWidth: 640 }}>
                <p style={{ margin: "0 0 0.28rem", color: "var(--text-main)", fontWeight: 850, fontSize: "1rem" }}>
                  {edu.qualification}
                </p>
                <p style={{ margin: "0 0 0.45rem", color: "#0f766e", fontWeight: 700, fontSize: "0.84rem" }}>
                  {edu.institution}
                </p>
                <span className="pp-timeline-period">{edu.period}</span>
              </div>
            ))}
          </Container>
        </section>
      )}

      {/* ── Career Goals ── */}
      <section className="pp-section">
        <Container>
          <Row className="g-4 align-items-start">
            <Col lg={5}>
              <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
                <p className="pp-section-eyebrow">Direction</p>
                <h2 className="pp-section-title">Where I'm headed</h2>
                <p className="pp-section-sub">
                  Building towards roles that combine technical leadership with real product impact
                  on distributed, international teams.
                </p>
              </div>
            </Col>
            <Col lg={7}>
              <div className="pp-goal-list">
                {profileData.careerGoals.map((goal) => (
                  <div key={goal} className="pp-goal-card">{goal}</div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="pp-cta-section">
        <Container>
          <div className="pp-cta-inner">
            <p className="pp-cta-eyebrow">Available now</p>
            <h2 className="pp-cta-title">Let's build something great</h2>
            <p className="pp-cta-sub">
              Open to full-time positions, contract projects, and long-term remote collaborations
              with international teams.
            </p>
            <div className="pp-cta-actions">
              <Button as={Link} to="/contact" className="pp-cta-btn-white btn">Contact Me</Button>
              <Button as={Link} to="/resume" className="pp-cta-btn-ghost btn">View Resume</Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
