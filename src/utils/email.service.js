import nodemailer from "nodemailer";

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email service is not configured", { cause: 500 });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendActivationEmail = async ({ to, userName, activationLink }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Electro Bites" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Activate your Electro Bites account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 560px;">
        <h2 style="margin-bottom: 8px;">Welcome to Electro Bites, ${userName}</h2>
        <p>Please activate your account by clicking the button below.</p>
        <p style="margin: 24px 0;">
          <a href="${activationLink}" style="background: #16a34a; color: #ffffff; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block;">
            Activate account
          </a>
        </p>
        <p>This activation link expires in 30 minutes.</p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #2563eb;">${activationLink}</p>
        <p>If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  });
};
