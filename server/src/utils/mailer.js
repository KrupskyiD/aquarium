import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  await transporter.sendMail({
    from: `"Aquarium App" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Verify your Aquarium account",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Welcome to Aquarium!</h2>
          <p>Thank you for registering. Please verify your email address to activate your account.</p>
          <a href="${process.env.APP_URL}/api/auth/verify?token=${token}" 
             style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Verify Email
          </a>
          <p style="color: #6b7280; font-size: 14px;">This link expires in 24 hours.</p>
          <p style="color: #6b7280; font-size: 14px;">If you did not create an account, you can safely ignore this email.</p>
        </div>
      `,
  });
};
