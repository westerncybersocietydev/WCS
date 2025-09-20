import mailgun from "mailgun-js";

const mailgunClient = mailgun({
  apiKey: process.env.MAILGUN_API_KEY || "dev-key",
  domain: process.env.MAILGUN_DOMAIN || "dev-domain.com",
});

export async function sendEmail({ to, from, subject, message }) {
  // DEV MODE - Skip email sending in development
  if (process.env.NODE_ENV === "development" || !process.env.MAILGUN_API_KEY) {
    console.log("🚀 DEV MODE: Skipping email sending");
    console.log("Email would be sent to:", to);
    console.log("Subject:", subject);
    return { success: true };
  }

  const emailData = {
    from,
    to,
    subject,
    html: message,
  };

  try {
    const result = await mailgunClient.messages().send(emailData);
    console.log("Email sent successfully!");
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
