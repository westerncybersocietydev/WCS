import mailgun from "mailgun-js";

const mailgunClient = mailgun({
  apiKey: process.env.MAILGUN_API_KEY || "dev-key",
  domain: process.env.MAILGUN_DOMAIN || "dev-domain.com",
});

export async function sendEmail({ to, from, subject, message }) {
  // Production mode - email sending required
  if (!process.env.MAILGUN_API_KEY) {
    console.error("MAILGUN_API_KEY is not configured");
    throw new Error("MAILGUN_API_KEY is not configured");
  }

  if (!process.env.MAILGUN_DOMAIN) {
    console.error("MAILGUN_DOMAIN is not configured");
    throw new Error("MAILGUN_DOMAIN is not configured");
  }

  const emailData = {
    from,
    to,
    subject,
    html: message,
  };

  console.log("Attempting to send email to:", to);
  console.log("Using Mailgun domain:", process.env.MAILGUN_DOMAIN);

  try {
    const result = await mailgunClient.messages().send(emailData);
    console.log("Email sent successfully!", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    console.error("Error details:", {
      message: error.message,
      statusCode: error.statusCode,
      body: error.body,
    });
    throw error;
  }
}
