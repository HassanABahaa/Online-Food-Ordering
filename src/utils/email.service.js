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

export const sendVerificationEmail = async ({ to, userName, otp }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Electro Bites" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your Electro Bites account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin-bottom: 8px;">Welcome to Electro Bites, ${userName}</h2>
        <p>Use this code to verify your account:</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; background: #f3f4f6; padding: 14px 18px; display: inline-block; border-radius: 8px;">
          ${otp}
        </div>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  });
};
