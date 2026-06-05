import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variable");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const info = await transporter.sendMail({
    from: emailUser,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
};