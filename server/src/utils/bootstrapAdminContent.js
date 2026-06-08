import BlogPost from "../models/BlogPost.js";
import Profile from "../models/Profile.js";
import Project from "../models/Project.js";

// Seed data lives here in the server — no frontend imports
const SEED_PROFILE = {
  fullName: "Ezika Trust Chidi",
  headline: "Full Stack Developer | Building Systems from Scratch",
  location: "Port Harcourt, Nigeria",
  phone: process.env.ADMIN_PHONE || "+2347037643440",
  professionalSummary:
    "Full Stack Developer with 3+ years of hands-on experience building scalable web applications from the ground up. Specialized in designing and implementing secure APIs, real-time systems, and payment processing solutions using React.js, Node.js, and MongoDB. Seeking opportunities to apply architectural knowledge and security expertise on production systems serving real users. Hungry to grow through solving complex, real-world problems.",
  skills: [
    "System Architecture",
    "API Development & Security",
    "Payment Processing",
    "Real-Time Systems",
    "Frontend Development",
    "Backend Development",
    "Database Design",
    "Production Skills",
  ],
  services: [
    "System Architecture: Building scalable systems from scratch, API design, database architecture, MVC patterns",
    "API Development & Security: RESTful API design, JWT authentication, secure endpoints, rate limiting, error handling",
    "Payment Processing: Stripe integration, payment workflows, transaction handling, financial data security",
    "Real-Time Systems: WebSockets, real-time data synchronization, live updates, event-driven architecture",
    "Frontend Development: React.js, TypeScript, JavaScript ES6+, responsive design, user-centered interfaces",
    "Backend Development: Node.js, Express.js, modular architecture, middleware design, database optimization",
    "Database Design: MongoDB schema design, query optimization, data consistency, transaction management",
    "Production Skills: Debugging, performance profiling, security best practices, code quality, Git workflows",
  ],
  technologyStack: [
    "React.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "Responsive Design",
    "Node.js", "Express.js", "RESTful APIs", "JWT Authentication", "MVC Architecture", "Middleware",
    "MongoDB", "Schema Design", "Query Optimization", "Data Modeling",
    "Stripe API", "Payment Workflows", "Transaction Handling", "PCI Compliance Awareness",
    "WebSockets", "Event-Driven Architecture", "Live Data Synchronization",
    "Git", "GitHub", "CI/CD Concepts", "Debugging", "Performance Optimization",
    "JWT tokens", "Secure endpoints", "Data validation", "Error handling", "Best practices",
  ],
  linkedin: "https://linkedin.com/in/trust-ezika-06845429a",
  github: "https://github.com/trubit",
  projects: [
    {
      title: "TronsOnShopping – Full Stack E-Commerce Platform",
      summary:
        "Complete e-commerce system: product catalog, shopping cart, checkout, order management. Frontend: React.js with responsive design, real-time cart synchronization. Backend: Node.js/Express APIs for products, users, orders, authentication, payment processing. Payment: Stripe integration with complete transaction workflow and security. Currently Building.",
    },
    {
      title: "TrusonXchanger – Real-Time Trading & Wallet System",
      summary:
        "Full-featured trading platform with real-time updates and secure transaction handling. Wallet system: accurate balance management, transaction history, withdrawal/deposit processing. Security: JWT authentication, secure endpoints, transaction validation, data integrity. Currently Building.",
    },
    {
      title: "Mobile Finance Application (iOS & Android)",
      summary:
        "Cross-platform financial application serving both iOS and Android. Real-time data synchronization across multiple devices. Secure authentication and user session management. Payment processing integration with backend APIs. Currently Building.",
    },
  ],
  blogTopics: [
    "Building scalable systems from scratch — API design, database architecture, MVC patterns",
    "RESTful API design with JWT authentication, secure endpoints, rate limiting",
    "Stripe payment integration — workflows, transaction handling, financial data security",
    "Real-time systems with WebSockets, data synchronization, event-driven architecture",
    "MongoDB schema design, query optimization, data consistency, transaction management",
    "Debugging, performance profiling, security best practices, code quality, Git workflows",
  ],
};

const toSlug = (input = "") =>
  String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const bootstrapAdminContent = async (user) => {
  const userId = user._id;

  const profile = await Profile.findOne({ user: userId });
  const hasProfileContent =
    profile &&
    (profile.brandStatement ||
      profile.skills?.length ||
      profile.services?.length ||
      profile.desiredRoles?.length);

  if (!hasProfileContent) {
    await Profile.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          brandStatement: SEED_PROFILE.professionalSummary,
          availability: "open",
          timezone: "Africa/Lagos",
          yearsOfExperience: 3,
          desiredRoles: ["Full Stack Developer"],
          jobSearchStatus: "actively-looking",
          preferredWorkModes: ["remote", "hybrid", "on-site"],
          targetRegions: ["International", "Remote"],
          requiresVisaSponsorship: true,
          willingToRelocate: true,
          languages: ["English"],
          skills: SEED_PROFILE.skills,
          services: SEED_PROFILE.services,
          socialLinks: {
            linkedin: SEED_PROFILE.linkedin,
            github: SEED_PROFILE.github,
            x: "",
            website: "",
          },
        },
      },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
    );
  }

  if (!user.headline || !user.location || !user.phoneNumber) {
    user.fullName = user.fullName || SEED_PROFILE.fullName;
    user.headline = user.headline || SEED_PROFILE.headline;
    user.location = user.location || SEED_PROFILE.location;
    user.phoneNumber = user.phoneNumber || SEED_PROFILE.phone;
    await user.save();
  }

  const projectCount = await Project.countDocuments({ user: userId });
  if (projectCount === 0) {
    await Project.insertMany(
      SEED_PROFILE.projects.map((project, index) => ({
        user: userId,
        title: project.title,
        summary: project.summary,
        techStack: SEED_PROFILE.technologyStack,
        repoUrl: "",
        liveUrl: "",
        coverImageUrl: "",
        featured: index === 0,
      })),
    );
  }

  const blogCount = await BlogPost.countDocuments();
  if (blogCount === 0) {
    await BlogPost.insertMany(
      SEED_PROFILE.blogTopics.map((title) => ({
        title,
        slug: toSlug(title),
        excerpt: title,
        content: `${title}\n\nDraft this article from the admin dashboard.`,
        tags: ["Full Stack", "Engineering"],
        published: true,
        publishedAt: new Date(),
        createdBy: userId,
      })),
    );
  }
};
