import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

export const sendAdminNotification = async (subject: string, html: string) => {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !ADMIN_EMAIL) {
        console.warn("Email configuration missing. Skipping notification.");
        console.log("Subject:", subject);
        return;
    }

    try {
        await transporter.sendMail({
            from: `"Bee Group System" <${SMTP_USER}>`,
            to: ADMIN_EMAIL,
            subject: subject,
            html: html,
        });
        console.log("Notification email sent successfully.");
    } catch (error) {
        console.error("Failed to send notification email:", error);
    }
};
