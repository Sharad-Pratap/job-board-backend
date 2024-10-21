"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendJobAlert = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create a transporter using environment variables
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
// Function to send a generic email
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log("Email sent");
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
});
exports.sendEmail = sendEmail;
// Function to send a job alert email
const sendJobAlert = (to, jobDetails, companyName) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: `"${companyName}" <${process.env.SMTP_USER}>`, // Use company name for sender
        to,
        subject: `New Job Opportunity at ${companyName}`,
        text: `We have an exciting new job opportunity for you: \n\n${jobDetails}\n\nVisit our platform to apply!`,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log("Job alert sent");
    }
    catch (error) {
        console.error("Error sending job alert:", error);
    }
});
exports.sendJobAlert = sendJobAlert;
