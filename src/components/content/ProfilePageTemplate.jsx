import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import RoomRoundedIcon from "@mui/icons-material/RoomRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import { profileData } from "../../content/profileData";

const emailAddress = profileData.email.trim();
const phoneNumber = profileData.phone.trim().replace(/\s+/g, "");
const phoneDigits = phoneNumber.replace(/\D/g, "");
const telLink = `tel:${phoneNumber}`;
const emailSubject = `Opportunity Discussion — ${profileData.fullName}`;
const emailBody = `Hello ${profileData.fullName},\n\nI came across your portfolio and would like to discuss an opportunity with you.\n\nBest regards,`;
const emailComposeLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  emailAddress,
)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
const whatsappLink = `https://wa.me/${phoneDigits}`;

const sectionTitleMap = {
  hero: "Executive Overview",
  summary: "Professional Summary",
  skills: "Skills",
  workExperience: "Work Experience",
  education: "Education",
  projects: "Projects",
  technologyStack: "Technology Stack",
  achievements: "Achievements",
  careerGoals: "Career Goals",
  contactInfo: "Contact Information",
  services: "Services",
  blog: "Blog",
  media: "Media",
};

const SectionCard = ({ title, sectionKey, children }) => (
  <Card className={`premium-card section-card section-card-${sectionKey}`}>
    <CardContent>
      <Typography className="section-eyebrow">Executive Portfolio</Typography>
      <Typography variant="h5" gutterBottom className="section-title">
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

const RenderSection = ({ sectionKey }) => {
  switch (sectionKey) {
    case "hero":
      return (
        <SectionCard title={sectionTitleMap.hero} sectionKey={sectionKey}>
          <div className="hero-premium-grid">
            <div>
              <Typography variant="h3" className="hero-title" gutterBottom>
                {profileData.fullName}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {profileData.headline}
              </Typography>
              <Typography color="text.secondary" className="hero-description">
                {profileData.heroStatement}
              </Typography>
              <Stack direction="row" spacing={1} className="hero-chip-row">
                <Chip icon={<RoomRoundedIcon />} label={profileData.location} />
                <Chip
                  icon={<WorkOutlineRoundedIcon />}
                  label="Open to remote international roles"
                />
              </Stack>
              <div className="hero-signal-row">
                {profileData.recruiterSignals.map((signal) => (
                  <div key={signal} className="hero-signal">
                    <VerifiedRoundedIcon fontSize="small" />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                className="hero-actions"
              >
                <Button
                  component={Link}
                  to="/resume"
                  variant="contained"
                  endIcon={<LaunchRoundedIcon />}
                >
                  View Resume
                </Button>
                <Button component={Link} to="/contact" variant="outlined">
                  Contact
                </Button>
              </Stack>
            </div>

            <aside className="executive-panel">
              <Typography className="executive-title">
                Recruiter Snapshot
              </Typography>
              <Stack spacing={1.1}>
                {profileData.recruiterSummary.map((item) => (
                  <div key={item.label} className="executive-row">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </Stack>
              <div className="executive-notes">
                {profileData.recruiterSnapshotNotes?.map((note) => (
                  <Typography key={note} className="executive-note-line">
                    {note}
                  </Typography>
                ))}
              </div>
              <div className="executive-contact">
                <div className="contact-line">
                  <MailOutlineRoundedIcon fontSize="small" />
                  <Typography>{profileData.email}</Typography>
                </div>
                <div className="contact-line">
                  <PhoneRoundedIcon fontSize="small" />
                  <Typography>{profileData.phone}</Typography>
                </div>
              </div>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                  size="small"
                  variant="text"
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  endIcon={<PublicRoundedIcon />}
                >
                  LinkedIn
                </Button>
                <Button
                  size="small"
                  variant="text"
                  href={profileData.github}
                  target="_blank"
                  rel="noreferrer"
                  endIcon={<LaunchRoundedIcon />}
                >
                  GitHub
                </Button>
                <Button
                  size="small"
                  variant="text"
                  component="a"
                  href={emailComposeLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Email
                </Button>
              </Stack>
            </aside>
          </div>
        </SectionCard>
      );

    case "summary":
      return (
        <SectionCard title={sectionTitleMap.summary} sectionKey={sectionKey}>
          <Typography color="text.secondary">{profileData.professionalSummary}</Typography>
        </SectionCard>
      );

    case "skills":
      return (
        <SectionCard title={sectionTitleMap.skills} sectionKey={sectionKey}>
          <div className="chip-list">
            {profileData.skills.map((skill) => (
              <Chip key={skill} label={skill} />
            ))}
          </div>
        </SectionCard>
      );

    case "workExperience":
      return (
        <SectionCard title={sectionTitleMap.workExperience} sectionKey={sectionKey}>
          <Stack spacing={2}>
            {profileData.workExperience.map((job) => (
              <div key={`${job.role}-${job.period}`} className="section-block timeline-block">
                <Typography variant="h6">
                  {job.role} | {job.company}
                </Typography>
                <Typography color="text.secondary" className="section-kicker">
                  {job.period}
                </Typography>
                <ul className="section-list">
                  {job.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Stack>
        </SectionCard>
      );

    case "education":
      return (
        <SectionCard title={sectionTitleMap.education} sectionKey={sectionKey}>
          <Stack spacing={1.5}>
            {profileData.education.map((item) => (
              <div key={`${item.qualification}-${item.institution}`} className="timeline-block">
                <Typography variant="h6">{item.qualification}</Typography>
                <Typography color="text.secondary">{item.institution}</Typography>
                <Typography color="text.secondary">
                  {item.period}{item.result ? ` | ${item.result}` : ""}
                </Typography>
              </div>
            ))}
          </Stack>
        </SectionCard>
      );

    case "projects":
      return (
        <SectionCard title={sectionTitleMap.projects} sectionKey={sectionKey}>
          <Stack spacing={2}>
            {profileData.projects.map((project) => (
              <div key={project.title} className="section-block timeline-block">
                <Typography variant="h6">{project.title}</Typography>
                {project.status && (
                  <Typography color="text.secondary" className="section-kicker">
                    {project.status}
                  </Typography>
                )}
                <ul className="section-list">
                  {project.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Stack>
        </SectionCard>
      );

    case "technologyStack":
      return (
        <SectionCard title={sectionTitleMap.technologyStack} sectionKey={sectionKey}>
          <div className="chip-list">
            {profileData.technologyStack.map((tech) => (
              <Chip key={tech} label={tech} color="primary" variant="outlined" />
            ))}
          </div>
        </SectionCard>
      );

    case "achievements":
      return (
        <SectionCard title={sectionTitleMap.achievements} sectionKey={sectionKey}>
          <ul className="section-list">
            {profileData.achievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>
      );

    case "careerGoals":
      return (
        <SectionCard title={sectionTitleMap.careerGoals} sectionKey={sectionKey}>
          <ul className="section-list">
            {profileData.careerGoals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </SectionCard>
      );

    case "contactInfo":
      return (
        <SectionCard title={sectionTitleMap.contactInfo} sectionKey={sectionKey}>
          <Typography color="text.secondary" className="section-kicker">
            For companies, recruiters, clients, and private-sector opportunities.
          </Typography>
          <Stack spacing={1.2}>
            <div className="contact-line">
              <MailOutlineRoundedIcon fontSize="small" />
              <Typography>{profileData.email}</Typography>
            </div>
            <div className="contact-line">
              <PhoneRoundedIcon fontSize="small" />
              <Typography>{profileData.phone}</Typography>
            </div>
            <div className="contact-line">
              <RoomRoundedIcon fontSize="small" />
              <Typography>{profileData.location}</Typography>
            </div>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button variant="contained" component="a" href={emailComposeLink} target="_blank" rel="noreferrer">
                Send Email
              </Button>
              <Button variant="outlined" component="a" href={telLink}>
                Call Phone
              </Button>
              <Button variant="outlined" href={whatsappLink} target="_blank" rel="noreferrer">
                WhatsApp
              </Button>
              <Button
                variant="text"
                href={profileData.linkedin}
                target="_blank"
                rel="noreferrer"
                endIcon={<LaunchRoundedIcon />}
              >
                LinkedIn
              </Button>
              <Button
                variant="text"
                href={profileData.github}
                target="_blank"
                rel="noreferrer"
                endIcon={<LaunchRoundedIcon />}
              >
                GitHub
              </Button>
            </Stack>
          </Stack>
        </SectionCard>
      );

    case "services":
      return (
        <SectionCard title={sectionTitleMap.services} sectionKey={sectionKey}>
          <ul className="section-list">
            {profileData.services.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>
      );

    case "blog":
      return (
        <SectionCard title={sectionTitleMap.blog} sectionKey={sectionKey}>
          <Typography color="text.secondary" className="section-kicker">
            Focus areas for technical writing and knowledge sharing:
          </Typography>
          <ul className="section-list">
            {profileData.blogTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </SectionCard>
      );

    case "media":
      return (
        <SectionCard title={sectionTitleMap.media} sectionKey={sectionKey}>
          <Typography color="text.secondary" className="section-kicker">
            Preferred media conversation topics:
          </Typography>
          <ul className="section-list">
            {profileData.mediaTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </SectionCard>
      );

    default:
      return null;
  }
};

export const ProfilePageTemplate = ({ pageTitle, pageDescription, sections = [] }) => (
  <Container className="portfolio-container">
    <section className="section-space">
      <Typography variant="h4">{pageTitle}</Typography>
      {pageDescription && (
        <Typography color="text.secondary" className="section-kicker">
          {pageDescription}
        </Typography>
      )}
      <div className="quick-contact-bar">
        <Typography className="quick-contact-text">
          Companies, recruiters, clients, and private-sector teams can contact me directly:
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Button size="small" variant="contained" component="a" href={emailComposeLink} target="_blank" rel="noreferrer">
            Email Me
          </Button>
          <Button size="small" variant="outlined" component="a" href={telLink}>
            Call Me
          </Button>
          <Button size="small" variant="outlined" href={whatsappLink} target="_blank" rel="noreferrer">
            WhatsApp
          </Button>
          <Button
            size="small"
            variant="text"
            href={profileData.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </Button>
        </Stack>
      </div>
    </section>

    <div className="section-grid">
      {sections.map((sectionKey) => (
        <div
          key={`${pageTitle}-${sectionKey}`}
          className={`section-space section-item section-item-${sectionKey}`}
        >
          <RenderSection sectionKey={sectionKey} />
        </div>
      ))}
    </div>
  </Container>
);
