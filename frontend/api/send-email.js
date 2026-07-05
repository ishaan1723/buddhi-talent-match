import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const data = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "info@techbharat.net, ceo4wisdom@gmail.com",
      subject: "New BTS Website Enquiry",
      html: `
        <h2>New Enquiry Received</h2>

        <p><b>Student Name:</b> ${data.studentName}</p>
        <p><b>Mobile Number:</b> ${data.mobileNumber}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Class:</b> ${data.class}</p>
        <p><b>School:</b> ${data.school}</p>
        <p><b>City:</b> ${data.city}</p>
        <p><b>Requirement:</b> ${data.requirement}</p>
        <p><b>Language:</b> ${data.language}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}