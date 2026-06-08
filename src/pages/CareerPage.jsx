import { useEffect } from "react";

import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { profileData } from "../content/profileData";
import { useProfileStore } from "../store/profileStore";
import "../styles/pages.css";

export const CareerPage = () => {
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
        <p className="pp-hero-eyebrow">Career Journey</p>
        <h1 className="pp-hero-title">From Zero to Production</h1>
        <p className="pp-hero-sub">
          Three years of engineering experience across full-stack products, back-end systems, and
          distributed APIs. Every role has been remote, self-directed, and outcome-driven.
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

    {/* ── Work Experience ── */}
    <section className="pp-section">
      <Container>
        <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
          <p className="pp-section-eyebrow">Experience</p>
          <h2 className="pp-section-title">Work history</h2>
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

    {/* ── Achievements ── */}
    <section className="pp-section pp-section--alt">
      <Container>
        <Row className="g-4 align-items-start">
          <Col lg={4}>
            <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
              <p className="pp-section-eyebrow">Impact</p>
              <h2 className="pp-section-title">Key achievements</h2>
              <p className="pp-section-sub" style={{ textAlign: "left" }}>
                Concrete outcomes delivered across engineering roles and independent projects.
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

    {/* ── Career Goals ── */}
    <section className="pp-section">
      <Container>
        <Row className="g-4 align-items-start">
          <Col lg={5}>
            <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1rem" }}>
              <p className="pp-section-eyebrow">Direction</p>
              <h2 className="pp-section-title">Where I'm headed</h2>
              <p className="pp-section-sub" style={{ textAlign: "left" }}>
                Building towards technical leadership roles within distributed international
                teams — combining strong engineering fundamentals with product-level thinking.
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

    {/* ── Skills Snapshot ── */}
    <section className="pp-section pp-section--alt">
      <Container>
        <div className="pp-section-header">
          <p className="pp-section-eyebrow">Capabilities</p>
          <h2 className="pp-section-title">Technical skills</h2>
          <p className="pp-section-sub">The full stack I use to architect, build, and ship products.</p>
        </div>
        <div className="pp-tech-grid" style={{ justifyContent: "center" }}>
          {skills.map((t) => (
            <span key={t} className="pp-tech-badge">{t}</span>
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
