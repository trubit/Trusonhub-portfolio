import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

export const mailerConfigured = Boolean(host && user && pass);

const transporter = mailerConfigured
  ? nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    })
  : null;

export const sendMail = async ({ to, subject, html, replyTo }) => {
  if (!transporter) {
    return { skipped: true, reason: "SMTP not configured" };
  }

  const from = process.env.EMAIL_FROM || user;
  const info = await transporter.sendMail({ from, to, subject, html, replyTo });
  return { skipped: false, messageId: info.messageId };
};

