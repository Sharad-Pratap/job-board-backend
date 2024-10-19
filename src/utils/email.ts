import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();


// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send a generic email
export const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to send a job alert email
export const sendJobAlert = async (
  to: string,
  jobDetails: string,
  companyName: string
) => {
  const mailOptions = {
    from: `"${companyName}" <${process.env.SMTP_USER}>`, // Use company name for sender
    to,
    subject: `New Job Opportunity at ${companyName}`,
    text: `We have an exciting new job opportunity for you: \n\n${jobDetails}\n\nVisit our platform to apply!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Job alert sent");
  } catch (error) {
    console.error("Error sending job alert:", error);
  }
};