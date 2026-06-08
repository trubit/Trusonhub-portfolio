import { useEffect } from "react";

import { Button, Container, Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { getCertificatesRequest } from "../api/certificateApi";
import { profileData } from "../content/profileData";
import { useMediaStore } from "../store/mediaStore";
import { useProfileStore } from "../store/profileStore";
import "../styles/media.css";

export const MediaPage = () => {
  const media = useMediaStore((s) => s.media);
  const mediaLoading = useMediaStore((s) => s.loading);
  const mediaLoaded = useMediaStore((s) => s.loaded);
  const mediaError = useMediaStore((s) => s.error);
  const loadMedia = useMediaStore((s) => s.load);

  const profileLoaded = useProfileStore((s) => s.loaded);
  const loadProfile = useProfileStore((s) => s.load);
  const getFullName = useProfileStore((s) => s.getFullName);
  const getHeadline = useProfileStore((s) => s.getHeadline);

  useEffect(() => {
    if (!mediaLoaded) loadMedia();
    if (!profileLoaded) loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fullName = getFullName();
  const headline = getHeadline();

  const { data: certificates = [] } = useQuery({
    queryKey: ["certificates"],
    queryFn: getCertificatesRequest,
    staleTime: 60_000,
  });

  // Separate featured from the rest so we don't duplicate it in the grid
  const uploadedVideos = media.interviewVideos.map((item) => ({
    id: `v-${item.url}`,
    type: "video",
    url: item.url,
    label: item.title || "Recorded Interview",
    embedUrl: null,
  }));

  const youtubeVideos = media.youtubeInterviews.map((item) => ({
    id: `yt-${item.url}`,
    type: "youtube",
    url: item.url,
    embedUrl: item.embedUrl,
    label: "YouTube Interview",
  }));

  const allInterviews = [...uploadedVideos, ...youtubeVideos];

  // Videos shown in the grid = all except the featured one
  const featuredUrl = media.featuredInterview?.url;
  const gridInterviews = allInterviews.filter((v) => v.url !== featuredUrl);

  if (mediaLoading && !mediaLoaded) {
    return (
      <main className="media-profile-page">
        <Container className="media-profile-container">
          <div className="media-loading-card">
            <Spinner animation="border" size="sm" />
            <span>Loading media…</span>
          </div>
        </Container>
      </main>
    );
  }

  if (mediaError && !mediaLoaded) {
    return (
      <main className="media-profile-page">
        <Container className="media-profile-container">
          <div className="media-loading-card">
            <span>⚠️ Failed to load media. Please refresh the page.</span>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="media-profile-page">
      <Container className="media-profile-container">

        {/* Page heading */}
        <section className="media-page-heading">
          <span className="media-eyebrow">Professional Profile</span>
          <h1>{fullName}</h1>
          <p>{profileData.heroStatement}</p>
        </section>

        {/* Cover + Profile Photo */}
        <section className="profile-preview-card" aria-label="Professional profile">
          <div className="profile-cover-stage">
            {media.coverImage ? (
              <img src={media.coverImage} alt={`${fullName} cover`} className="profile-cover-image" />
            ) : (
              <div className="profile-cover-empty"><span>Cover Image</span></div>
            )}
          </div>

          <div className="profile-identity-area">
            <div className="profile-photo-cluster">
              <div className="profile-photo-frame">
                {media.profilePhoto ? (
                  <img src={media.profilePhoto} alt={fullName} className="profile-photo-image" />
                ) : (
                  <div className="profile-photo-empty"><span>Photo</span></div>
                )}
              </div>
            </div>

            <div className="profile-copy-panel">
              <span className="profile-availability">Open to international opportunities</span>
              <h2>{fullName}</h2>
              <p className="profile-role">{headline}</p>
              <p className="profile-summary">{profileData.heroStatement}</p>
              <div className="profile-signal-row">
                {profileData.recruiterSnapshotNotes.map((note) => (
                  <span key={note}>{note}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            INTERVIEW VIDEOS — always visible to everyone
        ════════════════════════════════════════════════════ */}
        <section className="media-interview-section" aria-label="Interview videos">
          <div className="media-premium-panel">
            <div className="media-panel-header">
              <span className="media-eyebrow">Interview Proof</span>
              <h2>Recorded Interviews</h2>
              <p>
                Watch my professional recorded interviews. Available to companies, recruiters,
                and clients.
              </p>
            </div>

            {allInterviews.length === 0 ? (
              <div className="media-empty-state">
                <strong>No interview videos uploaded yet</strong>
                <span>Interview videos will appear here automatically once uploaded.</span>
              </div>
            ) : (
              <>
                {/* Featured interview — large hero player */}
                {media.featuredInterview && (
                  <div className="interview-hero-player">
                    <div className="interview-hero-badge">⭐ Featured Interview</div>
                    {media.featuredInterview.type === "youtube" ? (
                      <iframe
                        src={media.featuredInterview.embedUrl}
                        title="Featured interview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        allowFullScreen
                        className="interview-hero-frame"
                      />
                    ) : (
                      <video
                        className="interview-hero-frame"
                        controls
                        playsInline
                        preload="metadata"
                        src={media.featuredInterview.url}
                      />
                    )}
                    {media.featuredInterview.title && (
                      <p className="interview-hero-title">{media.featuredInterview.title}</p>
                    )}
                  </div>
                )}

                {/* Rest of the interviews — responsive grid */}
                {gridInterviews.length > 0 && (
                  <div className="interview-videos-grid">
                    {gridInterviews.map((item) => (
                      <div className="interview-video-card" key={item.id}>
                        {item.type === "youtube" ? (
                          <iframe
                            src={item.embedUrl}
                            title={item.label}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                            className="interview-card-frame"
                          />
                        ) : (
                          <video
                            className="interview-card-frame"
                            controls
                            playsInline
                            preload="metadata"
                            src={item.url}
                          />
                        )}
                        <div className="interview-card-meta">
                          <span className="interview-card-type">
                            {item.type === "youtube" ? "YouTube" : "Recorded"}
                          </span>
                          <strong className="interview-card-title">{item.label}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            CERTIFICATES — always visible credential showcase
        ════════════════════════════════════════════════════ */}
        <section className="media-certs-section" aria-label="Certificates and credentials">
          <div className="media-certs-header">
            <span className="media-eyebrow">Verified Credentials</span>
            <h2 className="media-certs-title">Certificates &amp; Qualifications</h2>
            <p className="media-certs-sub">
              Professional certifications earned and verified. Click any certificate to view
              the official credential.
            </p>
          </div>

          {certificates.length === 0 ? (
            <div className="media-certs-empty">
              <span className="media-certs-empty-icon">🎓</span>
              <strong>No certificates uploaded yet</strong>
              <span>Certificates will appear here once added from the dashboard.</span>
            </div>
          ) : (
            <div className="media-certs-grid">
              {[...certificates]
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((cert) => (
                  <div className="media-cert-card" key={cert._id}>
                    {/* Certificate image or placeholder */}
                    <div className="media-cert-img-wrap">
                      {cert.imageUrl ? (
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          className="media-cert-img"
                          loading="lazy"
                        />
                      ) : (
                        <div className="media-cert-img-placeholder">
                          <span>🎓</span>
                        </div>
                      )}
                      <div className="media-cert-verified-badge" title="Verified certificate">
                        ✓
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="media-cert-body">
                      <p className="media-cert-issuer">{cert.issuer || "Professional Certification"}</p>
                      <h3 className="media-cert-title">{cert.title}</h3>
                      {cert.description && (
                        <p className="media-cert-desc">{cert.description}</p>
                      )}
                      <div className="media-cert-footer">
                        {cert.issueDate && (
                          <span className="media-cert-date">Issued: {cert.issueDate}</span>
                        )}
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="media-cert-verify-btn"
                          >
                            Verify Credential ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════
            CV & RESUME — premium 2-column side-by-side
        ════════════════════════════════════════════════════ */}
        <section className="media-docs-section" aria-label="Hiring documents">
          <div className="media-docs-section-header">
            <span className="media-eyebrow">Hiring Documents</span>
            <h2 className="media-docs-section-title">Professional Credentials</h2>
            <p className="media-docs-section-sub">
              Recruiter-ready documents available for immediate preview and download.
            </p>
          </div>

          <div className="media-docs-grid">

            {/* ── CV card ── */}
            <div className="media-doc-card">
              <div className="media-doc-card-header">
                <div className="media-doc-pdf-badge">PDF</div>
                <div>
                  <p className="media-doc-label">Curriculum Vitae</p>
                  <h3 className="media-doc-title">Full CV</h3>
                  <p className="media-doc-desc">
                    Comprehensive work history, skills &amp; qualifications
                  </p>
                </div>
              </div>

              <div className="media-doc-preview-wrap">
                {media.cvPdf ? (
                  <iframe src={media.cvPdf} title="CV Preview" className="media-doc-iframe" />
                ) : (
                  <div className="media-doc-empty">
                    <span className="media-doc-empty-icon">📄</span>
                    <strong>CV not uploaded yet</strong>
                    <span>Check back soon.</span>
                  </div>
                )}
              </div>

              <div className="media-doc-card-footer">
                {media.cvPdf ? (
                  <Button
                    as="a"
                    href={media.cvPdf}
                    target="_blank"
                    rel="noreferrer"
                    className="media-doc-download-btn"
                  >
                    <span className="media-doc-btn-icon">↓</span>
                    Download CV
                  </Button>
                ) : (
                  <span className="doc-unavailable">Not available yet</span>
                )}
              </div>
            </div>

            {/* ── Resume card ── */}
            <div className="media-doc-card">
              <div className="media-doc-card-header">
                <div className="media-doc-pdf-badge media-doc-pdf-badge--resume">PDF</div>
                <div>
                  <p className="media-doc-label">Resume</p>
                  <h3 className="media-doc-title">Resume</h3>
                  <p className="media-doc-desc">
                    Concise professional summary tailored for recruiters
                  </p>
                </div>
              </div>

              <div className="media-doc-preview-wrap">
                {media.resumePdf ? (
                  <iframe src={media.resumePdf} title="Resume Preview" className="media-doc-iframe" />
                ) : (
                  <div className="media-doc-empty">
                    <span className="media-doc-empty-icon">📄</span>
                    <strong>Resume not uploaded yet</strong>
                    <span>Check back soon.</span>
                  </div>
                )}
              </div>

              <div className="media-doc-card-footer">
                {media.resumePdf ? (
                  <Button
                    as="a"
                    href={media.resumePdf}
                    target="_blank"
                    rel="noreferrer"
                    className="media-doc-download-btn media-doc-download-btn--resume"
                  >
                    <span className="media-doc-btn-icon">↓</span>
                    Download Resume
                  </Button>
                ) : (
                  <span className="doc-unavailable">Not available yet</span>
                )}
              </div>
            </div>

          </div>
        </section>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Button as={Link} to="/contact" className="media-action-button media-action-primary">
            Contact Me
          </Button>
        </div>

      </Container>
    </main>
  );
};
