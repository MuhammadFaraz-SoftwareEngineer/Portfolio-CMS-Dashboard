const nodemailer = require("nodemailer");
const Contact = require("../models/contact.model");
const env = require("../config/env");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

const submitContact = async ({ name, email, subject, message }) => {
  const contact = await Contact.create({ name, email, subject, message });

  await transporter.sendMail({
    from: `"${name} via Portfolio" <${env.EMAIL_USER}>`,
    to: env.EMAIL_USER,
    replyTo: email,
    subject: `📩 Portfolio Message: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f8ef7; border-bottom: 2px solid #4f8ef7; padding-bottom: 10px;">
          New Portfolio Contact Message
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555; width: 100px;">Name:</td>
            <td style="padding: 10px; color: #222;">${name}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; color: #555;">Email:</td>
            <td style="padding: 10px; color: #222;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555;">Subject:</td>
            <td style="padding: 10px; color: #222;">${subject}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
            <td style="padding: 10px; color: #222; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</td>
          </tr>
        </table>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">
          Sent from your portfolio contact form • ${new Date().toLocaleString()}
        </p>
      </div>
    `,
  });

  return contact;
};

const getAllContacts = async () => {
  return Contact.find().sort({ createdAt: -1 });
};

const getContactStats = async () => {
  const total = await Contact.countDocuments();
  const unread = await Contact.countDocuments({ read: false });
  return { total, unread };
};

module.exports = { submitContact, getAllContacts, getContactStats };
