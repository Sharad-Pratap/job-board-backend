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
exports.createJob = void 0;
const Job_1 = __importDefault(require("../models/Job"));
const email_1 = require("../utils/email");
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, description, experienceLevel, endDate, candidateEmails, } = req.body;
    // const companyId = (req as any).company.id;
    const companyId = (_a = req.company) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const newJob = new Job_1.default({
            title,
            description,
            experienceLevel,
            endDate,
            companyId,
        });
        yield newJob.save();
        // Send Job Alert Emails
        if (candidateEmails && candidateEmails.length > 0) {
            candidateEmails.forEach((email) => {
                const jobDetails = `Title: ${title}\nDescription: ${description}\nExperience Level: ${experienceLevel}`;
                (0, email_1.sendJobAlert)(email, jobDetails, req.company.name);
            });
        }
        res.json({ msg: "Job posted successfully", job: newJob });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
exports.createJob = createJob;
