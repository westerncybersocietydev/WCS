import mailgun from "mailgun-js";

const mailgunClient = mailgun({
  apiKey: process.env.MAILGUN_API_KEY || "dev-key",
  domain: process.env.MAILGUN_DOMAIN || "dev-domain.com",
});

export async function sendEmail({ to, from, subject, message }) {
  // Production mode - email sending required
  if (!process.env.MAILGUN_API_KEY) {
    throw new Error("MAILGUN_API_KEY is not configured");
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
