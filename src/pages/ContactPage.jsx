import { useEffect, useState } from "react";

import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { submitContactRequest } from "../api/contactApi";
import { profileData } from "../content/profileData";
import { useProfileStore } from "../store/profileStore";
import "../styles/pages.css";

/* ── SVG icons (static) ── */
const EMAIL_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const PHONE_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.39 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.29 6.29l.94-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);
const LINKEDIN_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const GITHUB_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);
const LOCATION_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const INIT_FORM = { name: "", email: "", subject: "", message: "" };

export const ContactPage = () => {
  const [form, setForm]     = useState(INIT_FORM);
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"

  const storeUser      = useProfileStore((s) => s.user);
  const getSocialLinks = useProfileStore((s) => s.getSocialLinks);
  const getLocation    = useProfileStore((s) => s.getLocation);
  const profileLoaded  = useProfileStore((s) => s.loaded);
  const loadProfile    = useProfileStore((s) => s.load);

  useEffect(() => {
    if (!profileLoaded) loadProfile();
  }, [profileLoaded, loadProfile]);

  const email    = storeUser?.email       || profileData.email;
  const phone    = storeUser?.phoneNumber || profileData.phone;
  const socialLinks = getSocialLinks();
  const linkedin = socialLinks.linkedin   || profileData.linkedin;
  const github   = socialLinks.github     || profileData.github;
  const location = getLocation();

  const phoneDigits = phone.replace(/\D/g, "");
  const waLink      = `https://wa.me/${phoneDigits}`;
  const mailLink    = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent("Opportunity — " + profileData.fullName)}`;

  const contactLinks = [
    { label: email,              href: mailLink,                                              icon: EMAIL_ICON    },
    { label: phone,              href: `tel:${phone}`,                                        icon: PHONE_ICON    },
    { label: "WhatsApp",         href: waLink,                                                icon: WA_ICON       },
    { label: "LinkedIn Profile", href: linkedin,                                              icon: LINKEDIN_ICON },
    { label: "GitHub Portfolio", href: github,                                                icon: GITHUB_ICON   },
    { label: location,           href: "https://maps.google.com/?q=Port+Harcourt+Nigeria",   icon: LOCATION_ICON },
  ];

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      await submitContactRequest(form);
      setStatus("success");
      setForm(INIT_FORM);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="pp-page">

      {/* ── Hero ── */}
      <section className="pp-hero">
        <div className="pp-hero-inner">
          <p className="pp-hero-eyebrow">Get In Touch</p>
          <h1 className="pp-hero-title">Let's Work Together</h1>
          <p className="pp-hero-sub">
            Available for full-time engineering roles, long-term contracts, and product partnerships.
            Based in Nigeria — 100% remote, open to international opportunities.
          </p>
          <div className="pp-hero-chips">
            <span className="pp-avail-chip pp-avail-chip--green">● Open to Work</span>
            <span className="pp-avail-chip pp-avail-chip--blue">Remote Ready</span>
            <span className="pp-avail-chip pp-avail-chip--teal">International Opportunities</span>
          </div>
        </div>
      </section>

      {/* ── Contact Grid ── */}
      <section className="pp-section">
        <Container>
          <Row className="g-4 align-items-start">

            {/* Left — Form */}
            <Col lg={7}>
              <div className="pp-card" style={{ padding: "1.75rem 1.8rem" }}>
                <div style={{ marginBottom: "1.4rem" }}>
                  <p className="pp-section-eyebrow" style={{ textAlign: "left" }}>Send a Message</p>
                  <h2 className="pp-section-title" style={{ textAlign: "left", fontSize: "1.4rem" }}>
                    Start a conversation
                  </h2>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <Row className="g-3">
                    <Col md={6}>
                      <div className="pp-form-group">
                        <label className="pp-form-label" htmlFor="cf-name">Full Name *</label>
                        <input
                          id="cf-name"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          className="pp-form-input"
                          placeholder="Jane Smith"
                          value={form.name}
                          onChange={onChange}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="pp-form-group">
                        <label className="pp-form-label" htmlFor="cf-email">Email Address *</label>
                        <input
                          id="cf-email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          className="pp-form-input"
                          placeholder="jane@company.com"
                          value={form.email}
                          onChange={onChange}
                        />
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="pp-form-group">
                        <label className="pp-form-label" htmlFor="cf-subject">Subject *</label>
                        <input
                          id="cf-subject"
                          name="subject"
                          type="text"
                          required
                          autoComplete="off"
                          className="pp-form-input"
                          placeholder="Engineering role / Project enquiry / Collaboration"
                          value={form.subject}
                          onChange={onChange}
                        />
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="pp-form-group" style={{ marginBottom: 0 }}>
                        <label className="pp-form-label" htmlFor="cf-message">Message *</label>
                        <textarea
                          id="cf-message"
                          name="message"
                          required
                          autoComplete="off"
                          className="pp-form-textarea"
                          placeholder="Tell me about the role, project, or opportunity…"
                          value={form.message}
                          onChange={onChange}
                        />
                      </div>
                    </Col>
                  </Row>

                  {status === "success" && (
                    <div className="pp-form-feedback pp-form-feedback--success">
                      Message sent successfully! I'll respond within 24 hours.
                    </div>
                  )}
                  {status === "error" && (
                    <div className="pp-form-feedback pp-form-feedback--error">
                      Something went wrong. Please try emailing me directly.
                    </div>
                  )}

                  <div style={{ marginTop: "1.1rem" }}>
                    <Button
                      type="submit"
                      className="pp-btn pp-btn--primary btn"
                      disabled={status === "sending"}
                      style={{ minWidth: 160 }}
                    >
                      {status === "sending" ? "Sending…" : "Send Message →"}
                    </Button>
                  </div>
                </form>
              </div>
            </Col>

            {/* Right — Info */}
            <Col lg={5}>
              <div style={{ marginBottom: "1.2rem" }}>
                <p className="pp-section-eyebrow" style={{ textAlign: "left" }}>Contact Details</p>
                <h2 className="pp-section-title" style={{ textAlign: "left", fontSize: "1.3rem" }}>
                  Direct channels
                </h2>
              </div>

              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="pp-contact-link"
                >
                  <span className="pp-contact-icon">{link.icon}</span>
                  <span className="pp-contact-link-label">{link.label}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.45 }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </a>
              ))}

              {/* Availability block */}
              <div className="pp-card" style={{ marginTop: "1.2rem", padding: "1.2rem 1.25rem" }}>
                <p style={{ margin: "0 0 0.7rem", color: "var(--text-main)", fontWeight: 850, fontSize: "0.88rem" }}>
                  Availability
                </p>
                <div className="pp-avail-chips">
                  <span className="pp-avail-chip pp-avail-chip--green">● Open to Work</span>
                  <span className="pp-avail-chip pp-avail-chip--blue">Remote Only</span>
                  <span className="pp-avail-chip pp-avail-chip--teal">International Roles</span>
                </div>
                <p style={{ margin: "0.9rem 0 0", color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: 1.62 }}>
                  Typical response time: within 24 hours. WhatsApp preferred for quick questions.
                </p>
              </div>
            </Col>

          </Row>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="pp-cta-section">
        <Container>
          <div className="pp-cta-inner">
            <p className="pp-cta-eyebrow">Quick links</p>
            <h2 className="pp-cta-title">Explore my work first</h2>
            <p className="pp-cta-sub">
              Review projects, services, and the full resume before reaching out — or contact me
              directly on any channel above.
            </p>
            <div className="pp-cta-actions">
              <Button as={Link} to="/portfolio" className="pp-cta-btn-white btn">View Portfolio</Button>
              <Button as={Link} to="/services" className="pp-cta-btn-ghost btn">Core Services</Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
