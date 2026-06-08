import { sendMail } from "../config/mailer.js";
import ContactMessage from "../models/ContactMessage.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const escHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

export const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, company, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error("name, email, subject and message are required");
  }

  const saved = await ContactMessage.create({
    name,
    email,
    company: company || "",
    subject,
    message,
  });

  const recipient = process.env.CONTACT_RECIPIENT || process.env.SMTP_USER;
  let mail = { skipped: true, reason: "No CONTACT_RECIPIENT or SMTP_USER configured" };

  if (recipient) {
    mail = await sendMail({
      to: recipient,
      replyTo: email,
      subject: `[TRUSONHUB] ${subject}`,
      html: `
        <h3>New contact message</h3>
        <p><strong>Name:</strong> ${escHtml(name)}</p>
        <p><strong>Email:</strong> ${escHtml(email)}</p>
        <p><strong>Company:</strong> ${escHtml(company || "N/A")}</p>
        <p><strong>Message:</strong></p>
        <p>${escHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    });
  }

  res.status(201).json({
    message: "Contact message received",
    contactId: saved._id,
    emailDelivery: mail,
  });
});

export const getContactMessages = asyncHandler(async (_req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages);
});

export const updateContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Contact message not found");
  }

  if (typeof req.body?.status === "string") {
    message.status = req.body.status;
  }

  await message.save();
  res.json(message);
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Contact message not found");
  }

  await message.deleteOne();
  res.status(204).send();
});
