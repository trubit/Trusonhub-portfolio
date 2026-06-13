import { useEffect } from "react";

import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { profileData } from "../content/profileData.js";
import { useMediaStore } from "../store/mediaStore";
import { useProfileStore } from "../store/profileStore";
import "../styles/pages.css";
import "../styles/resume.css";

export const ResumePage = () => {
  const resumePdf = useMediaStore((s) => s.media.resumePdf);
  const cvPdf     = useMediaStore((s) => s.media.cvPdf);
  const mediaLoaded = useMediaStore((s) => s.loaded);
  const loadMedia   = useMediaStore((s) => s.load);

  const storeUser      = useProfileStore((s) => s.user);
  const getFullName    = useProfileStore((s) => s.getFullName);
  const getHeadline    = useProfileStore((s) => s.getHeadline);
  const getLocation    = useProfileStore((s) => s.getLocation);
  const getSkills      = useProfileStore((s) => s.getSkills);
  const getSocialLinks = useProfileStore((s) => s.getSocialLinks);
  const profileLoaded  = useProfileStore((s) => s.loaded);
  const loadProfile    = useProfileStore((s) => s.load);

  useEffect(() => {
    if (!mediaLoaded) loadMedia();
    if (!profileLoaded) loadProfile();
  }, [mediaLoaded, loadMedia, profileLoaded, loadProfile]);

  const fullName = getFullName();
  const headline = getHeadline();
  const location = getLocation();
  const skills   = getSkills();
  const socialLinks = getSocialLinks();

  const email   = storeUser?.email       || profileData.email;
  const phone   = storeUser?.phoneNumber || profileData.phone;
  const linkedin = socialLinks.linkedin  || profileData.linkedin;
  const github   = socialLinks.github    || profileData.github;

  const phoneDigits = phone.replace(/\D/g, "");
  const waLink      = `https://wa.me/${phoneDigits}`;
  const mailLink    = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent("Opportunity Discussion — " + fullName)}&body=${encodeURIComponent("Hello " + fullName + ",\n\nI came across your portfolio and would like to discuss an opportunity with you.\n\nBest regards,")}`;

  return (
    <div className="resume-page">

      {/* ── Premium Hero Banner (unchanged) ── */}
      <div className="resume-hero">
        <Container>
          <div className="resume-hero-grid">

            {/* Left — identity + actions */}
            <div className="resume-hero-left">
              <div className="resume-available-badge">
                <span className="resume-avail-dot" />
                Available for International Roles
              </div>

              <h1 className="resume-hero-name">{fullName}</h1>
              <p className="resume-hero-headline">{headline}</p>

              <div className="resume-hero-meta">
                <span>📍 {location}</span>
                <span className="resume-meta-sep">|</span>
                <a
                  href={mailLink}
                  target="_blank"
                  rel="noreferrer"
                  className="resume-meta-link"
                >
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
                  <Link to="/media" className="resume-btn resume-btn-primary">View Documents</Link>
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
                {skills.slice(0, 10).map((skill) => (
                  <span key={skill} className="resume-skill-chip">{skill}</span>
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
                    <span className="resume-stat-value">10+</span>
                    <span className="resume-stat-desc">Production Projects</span>
                  </div>
                  <div className="resume-stat resume-stat-full">
                    <span className="resume-stat-value">Remote</span>
                    <span className="resume-stat-desc">Ready for international roles</span>
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
                  {profileData.professionalSummary}
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

      {/* ── Core Skills ── */}
      <section className="pp-section">
        <Container>
          <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
            <p className="pp-section-eyebrow">Competencies</p>
            <h2 className="pp-section-title">Core skills</h2>
          </div>
          <div className="pp-tech-grid">
            {skills.map((skill) => (
              <span key={skill} className="pp-tech-badge">{skill}</span>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Work Experience ── */}
      <section className="pp-section pp-section--alt">
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

      {/* ── Active Projects ── */}
      {(profileData.projects?.length > 0) && (
        <section className="pp-section">
          <Container>
            <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
              <p className="pp-section-eyebrow">Active Builds</p>
              <h2 className="pp-section-title">Current projects</h2>
            </div>
            <Row className="g-3">
              {profileData.projects.map((build) => (
                <Col sm={6} lg={4} key={build.title}>
                  <div className="pp-card pp-card--hoverable" style={{ borderTop: "3px solid #14b8a6", height: "100%", padding: "1.2rem" }}>
                    <p style={{ margin: "0 0 0.55rem", color: "var(--text-main)", fontWeight: 850, fontSize: "0.94rem" }}>
                      {build.title}
                    </p>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.38rem" }}>
                      {(build.points ?? []).map((pt) => (
                        <li key={pt} style={{ position: "relative", paddingLeft: "1rem", color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: 1.55 }}>
                          <span style={{ position: "absolute", left: 0, top: "0.45em", width: 5, height: 5, borderRadius: "50%", background: "#14b8a6", display: "block" }} />
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

      {/* ── Technology Stack ── */}
      <section className="pp-section pp-section--alt">
        <Container>
          <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
            <p className="pp-section-eyebrow">Technology</p>
            <h2 className="pp-section-title">Full tech stack</h2>
          </div>
          <div className="pp-tech-grid">
            {profileData.technologyStack.map((t) => (
              <span key={t} className="pp-tech-badge">{t}</span>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Education ── */}
      {profileData.education?.length > 0 && (
        <section className="pp-section">
          <Container>
            <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
              <p className="pp-section-eyebrow">Education</p>
              <h2 className="pp-section-title">Academic background</h2>
            </div>
            {profileData.education.map((edu) => (
              <div key={edu.institution} className="pp-card" style={{ maxWidth: 580 }}>
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

      {/* ── Achievements ── */}
      <section className="pp-section pp-section--alt">
        <Container>
          <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.2rem" }}>
            <p className="pp-section-eyebrow">Impact</p>
            <h2 className="pp-section-title">Key achievements</h2>
          </div>
          <ul className="pp-achievement-list" style={{ maxWidth: 820 }}>
            {profileData.achievements.map((a) => (
              <li key={a} className="pp-achievement-item">
                <span className="pp-achievement-dot" />
                <span className="pp-achievement-text">{a}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── Career Goals ── */}
      <section className="pp-section">
        <Container>
          <Row className="g-4 align-items-start">
            <Col lg={4}>
              <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "0.75rem" }}>
                <p className="pp-section-eyebrow">Direction</p>
                <h2 className="pp-section-title">Career goals</h2>
                <p className="pp-section-sub" style={{ textAlign: "left" }}>
                  Seeking roles that combine technical ownership with measurable product impact.
                </p>
              </div>
            </Col>
            <Col lg={8}>
              <div className="pp-goal-list">
                {profileData.careerGoals.map((goal) => (
                  <div key={goal} className="pp-goal-card">{goal}</div>
                ))}
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
            <h2 className="pp-section-title">Contact & availability</h2>
            <p className="pp-section-sub">
              Available for international remote opportunities. Response within 24 hours.
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
