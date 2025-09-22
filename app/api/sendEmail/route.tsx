import { sendEmail } from "../../utils/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { emailDetails } = await req.json();

    // Validate email details
    if (!emailDetails || typeof emailDetails !== "object") {
      return NextResponse.json(
        { error: "Invalid email details" },
        { status: 400 }
      );
    }

    const { to, from, subject, message } = emailDetails;

    if (!to || !from || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required email fields" },
        { status: 400 }
      );
    }

    if (
      typeof to !== "string" ||
      typeof from !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid email field types" },
        { status: 400 }
      );
    }

    await sendEmail(emailDetails);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}
