import { useEffect } from "react";

import { Col, Container, Row } from "react-bootstrap";

import { profileData } from "../content/profileData.js";
import { resumeData } from "../content/resumeData.js";
import { useMediaStore } from "../store/mediaStore";
import { useProfileStore } from "../store/profileStore";
import "../styles/pages.css";
import "../styles/resume.css";

const HERO_CHIPS = [
  "React.js", "Node.js", "MongoDB", "Stripe",
  "WebSockets", "Docker", "TypeScript", "Express.js",
  "JWT Authentication", "REST APIs",
];

export const ResumePage = () => {
  const resumePdf = useMediaStore((s) => s.media.resumePdf);
  const cvPdf     = useMediaStore((s) => s.media.cvPdf);
  const mediaLoaded = useMediaStore((s) => s.loaded);
  const loadMedia   = useMediaStore((s) => s.load);

  const storeUser      = useProfileStore((s) => s.user);
  const getFullName    = useProfileStore((s) => s.getFullName);
  const getHeadline    = useProfileStore((s) => s.getHeadline);
  const getLocation    = useProfileStore((s) => s.getLocation);
  const getSocialLinks = useProfileStore((s) => s.getSocialLinks);
  const profileLoaded  = useProfileStore((s) => s.loaded);
  const loadProfile    = useProfileStore((s) => s.load);

  useEffect(() => {
    if (!mediaLoaded) loadMedia();
    if (!profileLoaded) loadProfile();
  }, [mediaLoaded, loadMedia, profileLoaded, loadProfile]);

  const fullName    = getFullName();
  const headline    = getHeadline();
  const location    = getLocation();
  const socialLinks = getSocialLinks();

  const email    = storeUser?.email       || profileData.email;
  const phone    = storeUser?.phoneNumber || profileData.phone;
  const linkedin = socialLinks.linkedin   || profileData.linkedin;
  const github   = socialLinks.github     || profileData.github;

  const phoneDigits = phone.replace(/\D/g, "");
  const waLink   = `https://wa.me/${phoneDigits}`;
  const mailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent("Opportunity Discussion — " + fullName)}&body=${encodeURIComponent("Hello " + fullName + ",\n\nI came across your portfolio and would like to discuss an opportunity with you.\n\nBest regards,")}`;

  return (
    <div className="resume-page">

      {/* ── Hero Banner ── */}
      <div className="resume-hero">
        <Container>
          <div className="resume-hero-grid">

            {/* Left — identity + actions */}
            <div className="resume-hero-left">
              <div className="resume-available-badge">
                <span className="resume-avail-dot" />
                International Roles: Yes — Open to Global Relocation
              </div>

              <h1 className="resume-hero-name">{fullName}</h1>
              <p className="resume-hero-headline">{headline}</p>

              <div className="resume-hero-meta">
                <span>📍 {location}</span>
                <span className="resume-meta-sep">|</span>
                <a href={mailLink} target="_blank" rel="noreferrer" className="resume-meta-link">
                  ✉ {email}
                </a>
                <span className="resume-meta-sep">|</span>
                <a href={`tel:${phone}`} className="resume-meta-link">
                  📞 {phone}
                </a>
              </div>

              <div className="resume-hero-actions">
                {resumePdf ? (
                  <a href={resumePdf} target="_blank" rel="noreferrer" className="resume-btn resume-btn-primary">
                    <span className="resume-btn-icon">↓</span> Download Resume
                  </a>
                ) : (
                  <a href="/media" className="resume-btn resume-btn-primary">View Documents</a>
                )}
                {cvPdf && (
                  <a href={cvPdf} target="_blank" rel="noreferrer" className="resume-btn resume-btn-secondary">
                    <span className="resume-btn-icon">↓</span> Download CV
                  </a>
                )}
                <a href={linkedin} target="_blank" rel="noreferrer" className="resume-btn resume-btn-outline">
                  LinkedIn ↗
                </a>
                <a href={github} target="_blank" rel="noreferrer" className="resume-btn resume-btn-outline">
                  GitHub ↗
                </a>
                <a href={waLink} target="_blank" rel="noreferrer" className="resume-btn resume-btn-whatsapp">
                  WhatsApp ↗
                </a>
              </div>

              <div className="resume-skill-chips">
                {HERO_CHIPS.map((chip) => (
                  <span key={chip} className="resume-skill-chip">{chip}</span>
                ))}
              </div>
            </div>

            {/* Right — stats panel */}
            <div className="resume-hero-right">
              <div className="resume-stats-card">
                <p className="resume-stats-label">Recruiter Snapshot</p>
                <div className="resume-stats-grid">
                  <div className="resume-stat">
                    <span className="resume-stat-value">3+</span>
                    <span className="resume-stat-desc">Years Full Stack Experience</span>
                  </div>
                  <div className="resume-stat">
                    <span className="resume-stat-value">15+</span>
                    <span className="resume-stat-desc">Full-Stack Applications Built</span>
                  </div>
                  <div className="resume-stat resume-stat-full">
                    <span className="resume-stat-value">Remote</span>
                    <span className="resume-stat-desc">Remote, Hybrid, or On-site — International</span>
                  </div>
                </div>
                <div className="resume-signals">
                  {profileData.recruiterSnapshotNotes.map((note) => (
                    <div key={note} className="resume-signal-row">
                      <span className="resume-signal-dot" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
                <a href={mailLink} target="_blank" rel="noreferrer" className="resume-hire-btn">
                  ✉ Contact Me About an Opportunity
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Professional Summary ── */}
      <section className="pp-section pp-section--alt">
        <Container>
          <Row className="g-4 align-items-start">
            <Col lg={4}>
              <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "0.5rem" }}>
                <p className="pp-section-eyebrow">Summary</p>
                <h2 className="pp-section-title">Professional Profile</h2>
              </div>
            </Col>
            <Col lg={8}>
              <div className="pp-card" style={{ padding: "1.5rem 1.6rem" }}>
                <p style={{ margin: "0 0 1rem", color: "var(--text-muted)", fontSize: "0.93rem", lineHeight: 1.72 }}>
                  {resumeData.summary}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {profileData.recruiterSummary.map((item) => (
                    <div key={item.label} style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem 0.75rem", alignItems: "center" }}>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 800, minWidth: 80, flexShrink: 0 }}>
                        {item.label}
                      </span>
                      <span style={{ color: "var(--text-main)", fontSize: "0.88rem", fontWeight: 700, minWidth: 0 }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Core Technical Skills ── */}
      <section className="pp-section">
        <Container>
          <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
            <p className="pp-section-eyebrow">Competencies</p>
            <h2 className="pp-section-title">Core Technical Skills</h2>
          </div>
          <Row className="g-3">
            {resumeData.skillCategories.map((cat) => (
              <Col sm={6} lg={4} key={cat.category}>
                <div className="pp-card pp-card--hoverable" style={{ padding: "1.1rem 1.2rem", height: "100%" }}>
                  <p style={{ margin: "0 0 0.65rem", color: "var(--text-main)", fontWeight: 850, fontSize: "0.9rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                    {cat.category}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {cat.items.map((item) => (
                      <span key={item} className="pp-tech-badge" style={{ fontSize: "0.72rem", padding: "0.18rem 0.55rem" }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── Professional Experience ── */}
      <section className="pp-section pp-section--alt">
        <Container>
          <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
            <p className="pp-section-eyebrow">Experience</p>
            <h2 className="pp-section-title">Professional Experience</h2>
          </div>
          <div className="pp-timeline">
            {resumeData.workExperience.map((job) => (
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

      {/* ── Active Projects ── */}
      <section className="pp-section">
        <Container>
          <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
            <p className="pp-section-eyebrow">Active Builds</p>
            <h2 className="pp-section-title">Active Projects</h2>
          </div>
          <Row className="g-3">
            {resumeData.projects.map((proj) => (
              <Col sm={6} lg={4} key={proj.title}>
                <div className="pp-card pp-card--hoverable" style={{ borderTop: "3px solid #14b8a6", height: "100%", padding: "1.2rem" }}>
                  <p style={{ margin: "0 0 0.3rem", color: "var(--text-main)", fontWeight: 850, fontSize: "0.94rem" }}>
                    {proj.title}
                  </p>
                  <p style={{ margin: "0 0 0.55rem", color: "#0f766e", fontSize: "0.76rem", fontWeight: 700 }}>
                    {proj.tech}
                  </p>
                  <p style={{ margin: "0 0 0.6rem", color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: 1.55 }}>
                    {proj.desc}
                  </p>
                  <span style={{ display: "inline-block", background: "rgba(20,184,166,0.12)", color: "#0f766e", fontSize: "0.7rem", fontWeight: 750, padding: "0.15rem 0.55rem", borderRadius: "100px", border: "1px solid rgba(20,184,166,0.25)" }}>
                    {proj.status}
                  </span>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── Education ── */}
      <section className="pp-section pp-section--alt">
        <Container>
          <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
            <p className="pp-section-eyebrow">Education</p>
            <h2 className="pp-section-title">Academic Background</h2>
          </div>
          <div className="pp-card" style={{ maxWidth: 580 }}>
            <p style={{ margin: "0 0 0.28rem", color: "var(--text-main)", fontWeight: 850, fontSize: "1rem" }}>
              {resumeData.education.qualification}
            </p>
            <p style={{ margin: "0 0 0.45rem", color: "#0f766e", fontWeight: 700, fontSize: "0.84rem" }}>
              {resumeData.education.institution}
            </p>
            <span className="pp-timeline-period">{resumeData.education.period}</span>
          </div>
        </Container>
      </section>

      {/* ── Work Availability ── */}
      <section className="pp-section">
        <Container>
          <Row className="g-4 align-items-center">
            <Col lg={4}>
              <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "0.75rem" }}>
                <p className="pp-section-eyebrow">Availability</p>
                <h2 className="pp-section-title">Work Availability</h2>
              </div>
            </Col>
            <Col lg={8}>
              <div className="pp-card" style={{ padding: "1.4rem 1.6rem" }}>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.93rem", lineHeight: 1.72 }}>
                  {resumeData.workAvailability}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Contact Info ── */}
      <section className="pp-section pp-section--alt">
        <Container>
          <div className="pp-section-header">
            <p className="pp-section-eyebrow">Reach Out</p>
            <h2 className="pp-section-title">Contact & Availability</h2>
            <p className="pp-section-sub">
              Available for full-time roles — remote, hybrid, or on-site. International opportunities
              welcomed. Response within 24 hours.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <a href={mailLink} target="_blank" rel="noreferrer" className="pp-btn pp-btn--primary btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              ✉ Email Me
            </a>
            <a href={waLink} target="_blank" rel="noreferrer" className="pp-btn pp-btn--outline btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              WhatsApp
            </a>
            <a href={linkedin} target="_blank" rel="noreferrer" className="pp-btn pp-btn--outline btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              LinkedIn ↗
            </a>
            <a href={github} target="_blank" rel="noreferrer" className="pp-btn pp-btn--outline btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              GitHub ↗
            </a>
          </div>
        </Container>
      </section>

    </div>
  );
};
