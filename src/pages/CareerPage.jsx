import { useEffect } from "react";

import { Button, Col, Container, Row } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { getCertificatesRequest } from "../api/certificateApi";
import { profileData } from "../content/profileData";
import "../styles/pages.css";

export const CareerPage = () => {
  const { data: certs = [] } = useQuery({
    queryKey: ["certificates"],
    queryFn: getCertificatesRequest,
    staleTime: 5 * 60 * 1000,
  });

  return (
  <div className="pp-page">

    {/* ── Hero ── */}
    <section className="pp-hero">
      <div className="pp-hero-inner">
        <p className="pp-hero-eyebrow">Career Journey</p>
        <h1 className="pp-hero-title">From Zero to Production</h1>
        <p className="pp-hero-sub">
          3+ years of hands-on experience designing and building scalable web applications from
          the ground up — secure APIs, real-time WebSocket systems, Stripe payment integrations,
          and full-stack architectures. Every role has been remote, self-directed, and outcome-driven.
        </p>
        <div className="pp-hero-actions">
          <Button as={Link} to="/contact" className="pp-btn pp-btn--primary btn">Hire Me</Button>
          <Button as={Link} to="/resume" className="pp-btn pp-btn--outline btn">Download Resume</Button>
        </div>
        <div className="pp-hero-chips">
          <span className="pp-hero-chip">3+ Years Experience</span>
          <span className="pp-hero-chip">Full-Stack Developer</span>
          <span className="pp-hero-chip">Remote Ready</span>
        </div>
      </div>
    </section>

    {/* ── Professional Summary (CV section 2) ── */}
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
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.93rem", lineHeight: 1.72 }}>
                {profileData.professionalSummary}
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* ── Core Competencies (CV section 3) ── */}
    <section className="pp-section">
      <Container>
        <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
          <p className="pp-section-eyebrow">Competencies</p>
          <h2 className="pp-section-title">Core Competencies</h2>
        </div>
        <Row className="g-3">
          {profileData.skills.map((cat) => {
            const match = profileData.services.find((s) => s.startsWith(cat + ":"));
            const items = match
              ? match.replace(cat + ": ", "").split(", ")
              : [];
            return (
              <Col sm={6} lg={3} key={cat}>
                <div className="pp-card pp-card--hoverable" style={{ padding: "1.1rem 1.2rem", height: "100%" }}>
                  <p style={{ margin: "0 0 0.65rem", color: "var(--text-main)", fontWeight: 850, fontSize: "0.85rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                    {cat}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {items.map((item) => (
                      <span key={item} className="pp-tech-badge" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>

    {/* ── Technical Stack Summary (CV section 4) ── */}
    <section className="pp-section pp-section--alt">
      <Container>
        <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
          <p className="pp-section-eyebrow">Technology</p>
          <h2 className="pp-section-title">Technical Stack Summary</h2>
        </div>
        <div className="pp-tech-grid">
          {profileData.technologyStack.map((t) => (
            <span key={t} className="pp-tech-badge">{t}</span>
          ))}
        </div>
      </Container>
    </section>

    {/* ── Work Experience (CV section 5) ── */}
    <section className="pp-section">
      <Container>
        <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
          <p className="pp-section-eyebrow">Experience</p>
          <h2 className="pp-section-title">Professional Experience</h2>
          <p className="pp-section-sub" style={{ textAlign: "left" }}>
            Hands-on engineering roles where I owned the full development lifecycle — from system
            design to production deployment.
          </p>
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

    {/* ── Active Projects (CV section 6) ── */}
    <section className="pp-section pp-section--alt">
      <Container>
        <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
          <p className="pp-section-eyebrow">Active Builds</p>
          <h2 className="pp-section-title">Active Projects</h2>
        </div>
        <Row className="g-3">
          {profileData.projects.map((proj) => (
            <Col sm={6} lg={4} key={proj.title}>
              <div className="pp-card pp-card--hoverable" style={{ borderTop: "3px solid #14b8a6", height: "100%", padding: "1.2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.55rem" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 2.5px rgba(34,197,94,0.25)", flexShrink: 0 }} />
                  <span style={{ color: "#22c55e", fontSize: "0.72rem", fontWeight: 800 }}>{proj.status}</span>
                </div>
                <p style={{ margin: "0 0 0.55rem", color: "var(--text-main)", fontWeight: 850, fontSize: "0.94rem" }}>
                  {proj.title}
                </p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.38rem" }}>
                  {proj.points.map((pt) => (
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

    {/* ── Education (CV section 7) ── */}
    {profileData.education?.length > 0 && (
      <section className="pp-section">
        <Container>
          <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
            <p className="pp-section-eyebrow">Education</p>
            <h2 className="pp-section-title">Academic Background</h2>
          </div>
          {profileData.education.map((edu) => (
            <div key={edu.institution} className="pp-card" style={{ maxWidth: 600 }}>
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

    {/* ── Additional Information / Achievements (CV section 8) ── */}
    <section className="pp-section pp-section--alt">
      <Container>
        <Row className="g-4 align-items-start">
          <Col lg={4}>
            <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
              <p className="pp-section-eyebrow">Additional Information</p>
              <h2 className="pp-section-title">Key Achievements</h2>
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

    {/* ── Work Availability / Career Goals (CV section 9) ── */}
    <section className="pp-section">
      <Container>
        <Row className="g-4 align-items-start">
          <Col lg={5}>
            <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
              <p className="pp-section-eyebrow">Work Availability</p>
              <h2 className="pp-section-title">Where I'm headed</h2>
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

    {/* ── Certifications (DB — verified credentials) ── */}
    {certs.length > 0 && (
      <section className="pp-section pp-section--alt">
        <Container>
          <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
            <p className="pp-section-eyebrow">Credentials</p>
            <h2 className="pp-section-title">Certifications</h2>
          </div>
          <Row className="g-3">
            {certs.map((cert) => (
              <Col key={cert._id} sm={6} lg={4}>
                <div className="pp-card pp-card--hoverable" style={{ height: "100%", padding: "1.2rem 1.1rem" }}>
                  {cert.imageUrl && (
                    <img src={cert.imageUrl} alt={cert.title} style={{ height: 52, objectFit: "contain", marginBottom: "0.7rem", borderRadius: 6 }} />
                  )}
                  <p style={{ margin: "0 0 0.22rem", color: "var(--text-main)", fontWeight: 850, fontSize: "0.9rem" }}>{cert.title}</p>
                  {cert.issuer && <p style={{ margin: "0 0 0.25rem", color: "#0f766e", fontWeight: 700, fontSize: "0.78rem" }}>{cert.issuer}</p>}
                  {cert.issueDate && <span className="pp-timeline-period">{cert.issueDate}</span>}
                  {cert.description && (
                    <p style={{ margin: "0.5rem 0 0", color: "var(--text-muted)", fontSize: "0.78rem", lineHeight: 1.58 }}>{cert.description}</p>
                  )}
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "0.7rem", color: "#0f766e", fontSize: "0.78rem", fontWeight: 700 }}>
                      View credential ↗
                    </a>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    )}

    {/* ── Leadership Experience ── */}
    <section className="pp-section">
      <Container>
        <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
          <p className="pp-section-eyebrow">Leadership</p>
          <h2 className="pp-section-title">Leadership Experience</h2>
          <p className="pp-section-sub" style={{ textAlign: "left" }}>
            Technical leadership roles — driving architecture, security decisions, and full project delivery as the lead engineer.
          </p>
        </div>
        <div className="pp-timeline">
          {profileData.leadership.map((item) => (
            <div key={item.role + item.org} className="pp-timeline-item">
              <div className="pp-timeline-dot" />
              <div className="pp-timeline-content">
                <div className="pp-timeline-header">
                  <div>
                    <p className="pp-timeline-role">{item.role}</p>
                    <p className="pp-timeline-company">{item.org}</p>
                  </div>
                  {item.period && <span className="pp-timeline-period">{item.period}</span>}
                </div>
                <ul className="pp-timeline-list">
                  {item.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>

    {/* ── Internship & Training ── */}
    <section className="pp-section pp-section--alt">
      <Container>
        <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
          <p className="pp-section-eyebrow">Early Career</p>
          <h2 className="pp-section-title">Internship &amp; Training</h2>
          <p className="pp-section-sub" style={{ textAlign: "left" }}>
            Foundational professional experience gained through industrial training during the HND program.
          </p>
        </div>
        <div className="pp-timeline">
          {profileData.internshipExperience.map((item) => (
            <div key={item.role + item.org} className="pp-timeline-item">
              <div className="pp-timeline-dot" />
              <div className="pp-timeline-content">
                <div className="pp-timeline-header">
                  <div>
                    <p className="pp-timeline-role">{item.role}</p>
                    <p className="pp-timeline-company">{item.org}</p>
                  </div>
                  {item.period && <span className="pp-timeline-period">{item.period}</span>}
                </div>
                <ul className="pp-timeline-list">
                  {item.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>

    {/* ── CTA ── */}
    <section className="pp-cta-section">
      <Container>
        <div className="pp-cta-inner">
          <p className="pp-cta-eyebrow">Open to work</p>
          <h2 className="pp-cta-title">Ready for your next hire?</h2>
          <p className="pp-cta-sub">
            Available for senior full-stack roles, engineering contracts, and technical
            partnerships. Remote-first, international-ready.
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
