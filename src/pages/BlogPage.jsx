import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { usePublicBlogPosts } from "../hooks/useBlog";
import "../styles/pages.css";

const TOPIC_PREVIEWS = [
  { title: "Implementing JWT Auth in Node.js", tags: ["Security", "Node.js", "API"] },
  { title: "GridFS for Binary File Storage in MongoDB", tags: ["MongoDB", "Back-end", "Storage"] },
  { title: "Building Real-Time Apps with Socket.IO", tags: ["WebSockets", "Node.js", "React"] },
  { title: "Structuring Scalable Express APIs", tags: ["Architecture", "Express", "REST"] },
  { title: "Stripe Webhook Handling in Production", tags: ["Payments", "Stripe", "Node.js"] },
  { title: "React 19 Patterns for Production Apps", tags: ["React", "Frontend", "Performance"] },
];

const formatDate = (d) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
};

export const BlogPage = () => {
  const { data, isLoading, isError } = usePublicBlogPosts();

  const posts = data ?? [];

  return (
    <div className="pp-page">

      {/* ── Hero ── */}
      <section className="pp-hero">
        <div className="pp-hero-inner">
          <p className="pp-hero-eyebrow">Engineering Insights</p>
          <h1 className="pp-hero-title">Technical Blog</h1>
          <p className="pp-hero-sub">
            Implementation notes, architecture decisions, and engineering lessons drawn directly
            from real-world production projects. No theory-only posts — only patterns that shipped.
          </p>
          <div className="pp-hero-chips">
            <span className="pp-hero-chip">Node.js</span>
            <span className="pp-hero-chip">React</span>
            <span className="pp-hero-chip">MongoDB</span>
            <span className="pp-hero-chip">System Design</span>
            <span className="pp-hero-chip">Security</span>
          </div>
        </div>
      </section>

      {/* ── Posts ── */}
      <section className="pp-section">
        <Container>

          {isLoading && (
            <div className="pp-loading">
              <span className="pp-spinner" />
              Loading posts…
            </div>
          )}

          {isError && (
            <div className="pp-empty">
              <div className="pp-empty-icon">⚠️</div>
              <p className="pp-empty-title">Failed to load posts</p>
              <p className="pp-empty-sub">Please refresh the page to try again.</p>
            </div>
          )}

          {!isLoading && !isError && posts.length > 0 && (
            <>
              <div className="pp-section-header pp-section-header--left" style={{ marginBottom: "1.5rem" }}>
                <p className="pp-section-eyebrow">Latest</p>
                <h2 className="pp-section-title">{posts.length} post{posts.length !== 1 ? "s" : ""} published</h2>
              </div>
              <Row className="g-4">
                {posts.map((post) => (
                  <Col md={6} lg={4} key={post._id}>
                    <div className="pp-blog-card">
                      <div className="pp-blog-body">
                        <div className="pp-blog-tags">
                          {(post.tags ?? []).slice(0, 3).map((tag) => (
                            <span key={tag} className="pp-blog-tag">{tag}</span>
                          ))}
                          {(!post.tags || post.tags.length === 0) && (
                            <span className="pp-blog-tag">Engineering</span>
                          )}
                        </div>
                        <h3 className="pp-blog-title">{post.title}</h3>
                        {post.excerpt && (
                          <p className="pp-blog-excerpt">{post.excerpt}</p>
                        )}
                        <p className="pp-blog-meta">
                          {formatDate(post.createdAt || post.publishedAt)}
                        </p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </>
          )}

          {!isLoading && !isError && posts.length === 0 && (
            <>
              <div className="pp-section-header">
                <p className="pp-section-eyebrow">Coming Soon</p>
                <h2 className="pp-section-title">Posts are on the way</h2>
                <p className="pp-section-sub">
                  Technical writing is in progress. Here's a preview of topics being documented
                  from active engineering work.
                </p>
              </div>
              <Row className="g-3">
                {TOPIC_PREVIEWS.map((t) => (
                  <Col sm={6} lg={4} key={t.title}>
                    <div className="pp-blog-card" style={{ opacity: 0.72 }}>
                      <div className="pp-blog-body">
                        <div className="pp-blog-tags">
                          {t.tags.map((tag) => (
                            <span key={tag} className="pp-blog-tag">{tag}</span>
                          ))}
                        </div>
                        <h3 className="pp-blog-title">{t.title}</h3>
                        <p className="pp-blog-excerpt">
                          Deep-dive implementation post coming soon. This article covers real
                          patterns from production systems.
                        </p>
                        <p className="pp-blog-meta" style={{ fontStyle: "italic" }}>In progress</p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="pp-cta-section">
        <Container>
          <div className="pp-cta-inner">
            <p className="pp-cta-eyebrow">Let's connect</p>
            <h2 className="pp-cta-title">Interested in working together?</h2>
            <p className="pp-cta-sub">
              Available for engineering roles, consulting, and technical collaborations on ambitious
              products.
            </p>
            <div className="pp-cta-actions">
              <Button as={Link} to="/contact" className="pp-cta-btn-white btn">Contact Me</Button>
              <Button as={Link} to="/projects" className="pp-cta-btn-ghost btn">View Projects</Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
