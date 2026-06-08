import { useState } from "react";

import { Button, Card, Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

import { profileData } from "../content/profileData";
import { usePublicProjects } from "../hooks/useProjects";
import { resolveMediaUrl } from "../utils/mediaUrl";
import "../styles/pages.css";

/* ── Unified image section ───────────────────────────────────────
   First image in imageUrls is the large header.
   Remaining images appear as a clickable thumbnail strip.
   Falls back to the legacy coverImageUrl field so old projects
   still display something.
───────────────────────────────────────────────────────────────── */
const ImageSection = ({ imageUrls, coverImageUrl, title, featured }) => {
  const [lightbox, setLightbox] = useState(null);

  const gallery = (imageUrls || []).filter(Boolean);
  /* backward compat: old projects may only have coverImageUrl */
  const images  = gallery.length > 0 ? gallery : (coverImageUrl ? [coverImageUrl] : []);
  const main    = images[0] || null;
  const strip   = images.slice(1);

  if (!main) {
    /* No images — render nothing; card body stands alone */
    return featured ? (
      <div className="project-card-cover-wrap project-card-cover-wrap--badge-only">
        <span className="project-featured-badge project-featured-badge--static">⭐ Featured</span>
      </div>
    ) : null;
  }

  return (
    <>
      <div className="project-card-cover-wrap">
        <img
          src={resolveMediaUrl(main)}
          alt={title}
          className="project-card-cover-img"
          style={{ cursor: "zoom-in" }}
          onClick={() => setLightbox(resolveMediaUrl(main))}
        />
        {featured && <span className="project-featured-badge">⭐ Featured</span>}
      </div>

      {strip.length > 0 && (
        <div className="project-gallery-strip">
          {strip.map((url, i) => (
            <img
              key={i}
              src={resolveMediaUrl(url)}
              alt={`${title} screenshot ${i + 2}`}
              className="project-gallery-thumb"
              onClick={() => setLightbox(resolveMediaUrl(url))}
            />
          ))}
        </div>
      )}

      {lightbox && (
        <div className="project-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="enlarged" className="project-lightbox-img" />
        </div>
      )}
    </>
  );
};

/* ── Video section ───────────────────────────────────────────── */
const VideoSection = ({ videoUrls }) => {
  if (!videoUrls || videoUrls.length === 0) return null;

  return (
    <div className="project-video-section">
      {videoUrls.map((url, i) => (
        <video
          key={i}
          src={resolveMediaUrl(url)}
          controls
          preload="metadata"
          className="project-video-player"
        />
      ))}
    </div>
  );
};

/* ── Gallery for the detail modal (all images) ───────────────── */
const ModalGallery = ({ imageUrls, coverImageUrl, title }) => {
  const [lightbox, setLightbox] = useState(null);

  const gallery = (imageUrls || []).filter(Boolean);
  const images  = gallery.length > 0 ? gallery : (coverImageUrl ? [coverImageUrl] : []);

  if (images.length === 0) return null;

  return (
    <>
      <img
        src={resolveMediaUrl(images[0])}
        alt={title}
        className="project-detail-cover"
        style={{ cursor: "zoom-in" }}
        onClick={() => setLightbox(resolveMediaUrl(images[0]))}
      />

      {images.length > 1 && (
        <div className="project-gallery-strip mb-3">
          {images.slice(1).map((url, i) => (
            <img
              key={i}
              src={resolveMediaUrl(url)}
              alt={`${title} ${i + 2}`}
              className="project-gallery-thumb"
              onClick={() => setLightbox(resolveMediaUrl(url))}
            />
          ))}
        </div>
      )}

      {lightbox && (
        <div className="project-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="enlarged" className="project-lightbox-img" />
        </div>
      )}
    </>
  );
};

/* ── Project detail modal ────────────────────────────────────── */
const ProjectDetailModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <Modal show onHide={onClose} size="lg" scrollable centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {project.category && (
            <span className="project-category-badge me-2">{project.category}</span>
          )}
          {project.title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <ModalGallery
          imageUrls={project.imageUrls}
          coverImageUrl={project.coverImageUrl}
          title={project.title}
        />

        <div className="project-detail-description">
          {project.fullDescription || project.summary}
        </div>

        {project.techStack?.length > 0 && (
          <div className="project-tech-tags mt-3">
            {project.techStack.map((t) => (
              <span key={t} className="project-tech-tag">{t}</span>
            ))}
          </div>
        )}

        {(project.videoUrls || []).length > 0 && (
          <div className="mt-3">
            <p className="project-detail-section-label">Project Videos</p>
            <VideoSection videoUrls={project.videoUrls} />
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noreferrer" className="project-link-btn">
            GitHub ↗
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-link-btn">
            Live Demo ↗
          </a>
        )}
        <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

/* ── Main page ───────────────────────────────────────────────── */
export const ProjectsPage = () => {
  const projectsQuery  = usePublicProjects();
  const [detailProject, setDetailProject] = useState(null);
  const dbProjects     = projectsQuery.data || [];

  return (
    <div className="pp-page">

      {/* ── Premium Hero ── */}
      <section className="pp-hero">
        <div className="pp-hero-inner">
          <p className="pp-hero-eyebrow">Engineering Work</p>
          <h1 className="pp-hero-title">Portfolio Projects</h1>
          <p className="pp-hero-sub">
            Full-stack applications designed and built from scratch — with production-grade
            security, real-time capabilities, and clean architecture as the baseline.
          </p>
          <div className="pp-hero-actions">
            <Button as={Link} to="/contact" className="pp-btn pp-btn--primary btn">Hire Me</Button>
            <Button as={Link} to="/services" className="pp-btn pp-btn--outline btn">View Services</Button>
          </div>
          <div className="pp-hero-chips">
            <span className="pp-hero-chip">MERN Stack</span>
            <span className="pp-hero-chip">REST APIs</span>
            <span className="pp-hero-chip">Real-Time</span>
            <span className="pp-hero-chip">Payment Systems</span>
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="pp-section">
        <Container className="project-media-page">

          {projectsQuery.isLoading && (
            <div className="pp-loading">
              <span className="pp-spinner" /> Loading projects…
            </div>
          )}

          {projectsQuery.isError && (
            <div className="pp-empty">
              <div className="pp-empty-icon">⚠️</div>
              <p className="pp-empty-title">Failed to load projects</p>
              <p className="pp-empty-sub">Please refresh the page to try again.</p>
            </div>
          )}

          {/* ── DB projects ── */}
          {!projectsQuery.isError && dbProjects.length > 0 && (
            <div className="mb-4">
              <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
                <p className="pp-section-eyebrow">Featured</p>
                <h2 className="pp-section-title">{dbProjects.length} project{dbProjects.length !== 1 ? "s" : ""} in portfolio</h2>
              </div>
              <Row className="g-3">
                {dbProjects.map((project) => (
              <Col key={project._id} xs={12} md={6} lg={4}>
                <Card
                  className={`project-media-card h-100${project.featured ? " project-card--featured" : ""}`}
                  style={{ overflow: "hidden" }}
                >
                  <ImageSection
                    imageUrls={project.imageUrls}
                    coverImageUrl={project.coverImageUrl}
                    title={project.title}
                    featured={project.featured}
                  />

                  <Card.Body className="d-flex flex-column">
                    {project.category && (
                      <span className="project-category-badge">{project.category}</span>
                    )}
                    <Card.Title as="h6" className="mt-1 mb-1">{project.title}</Card.Title>
                    <Card.Text className="project-card-summary">{project.summary}</Card.Text>

                    {project.techStack?.length > 0 && (
                      <div className="project-tech-tags">
                        {project.techStack.map((t) => (
                          <span key={t} className="project-tech-tag">{t}</span>
                        ))}
                      </div>
                    )}

                    <div className="project-card-actions">
                      {project.repoUrl && (
                        <a href={project.repoUrl} target="_blank" rel="noreferrer" className="project-link-btn">
                          GitHub ↗
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-link-btn">
                          Live Demo ↗
                        </a>
                      )}
                      {(project.fullDescription ||
                        (project.imageUrls || []).length > 0 ||
                        (project.videoUrls || []).length > 0) && (
                        <button
                          className="project-detail-btn"
                          onClick={() => setDetailProject(project)}
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </Card.Body>

                  <VideoSection videoUrls={project.videoUrls} />
                </Card>
              </Col>
            ))}
              </Row>
            </div>
          )}

          {/* ── Static fallback (no DB projects yet) ── */}
          {!projectsQuery.isLoading && !projectsQuery.isError && dbProjects.length === 0 && (
            <div className="mb-4">
              <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
                <p className="pp-section-eyebrow">Active Builds</p>
                <h2 className="pp-section-title">Projects in development</h2>
              </div>
              <Row className="g-3">
                {profileData.projects.map((project) => (
                  <Col key={project.title} xs={12} md={6} lg={4}>
                    <div className="pp-card pp-card--hoverable" style={{ borderTop: "3px solid #14b8a6", height: "100%" }}>
                      {project.status && (
                        <span style={{
                          display: "inline-block", marginBottom: "0.6rem",
                          padding: "0.25rem 0.65rem", borderRadius: 999,
                          background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)",
                          color: "#22c55e", fontSize: "0.72rem", fontWeight: 800,
                        }}>
                          ● {project.status}
                        </span>
                      )}
                      <p style={{ margin: "0 0 0.55rem", color: "var(--text-main)", fontWeight: 850, fontSize: "0.96rem" }}>
                        {project.title}
                      </p>
                      <ul className="pp-timeline-list" style={{ margin: 0 }}>
                        {project.points.map((point) => <li key={point}>{point}</li>)}
                      </ul>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          <ProjectDetailModal project={detailProject} onClose={() => setDetailProject(null)} />
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="pp-cta-section">
        <Container>
          <div className="pp-cta-inner">
            <p className="pp-cta-eyebrow">Open to work</p>
            <h2 className="pp-cta-title">Impressed by the work?</h2>
            <p className="pp-cta-sub">
              Available for full-time roles and contracts. Let's build your next product together.
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
