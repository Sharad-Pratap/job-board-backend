import express, { Request, Response } from "express";
import Job from "../models/Job";
import { sendJobAlert } from "../utils/email";
import mongoose from "mongoose";

export const createJob = async (req: Request, res: Response) => {
  const {
    title,
    description,
    experienceLevel,
    endDate,
    candidateEmails,
  } = req.body;
  // const companyId = (req as any).company.id;
  const companyId = (req as any).company?.id;

  try {
    const newJob = new Job({
      title,
      description,
      experienceLevel,
      endDate,
      companyId,
    });

    await newJob.save();

    // Send Job Alert Emails
    if (candidateEmails && candidateEmails.length > 0) {
      candidateEmails.forEach((email: string) => {
        const jobDetails = `Title: ${title}\nDescription: ${description}\nExperience Level: ${experienceLevel}`;
        sendJobAlert(email, jobDetails, (req as any).company.name);
      });
    }

    res.json({ msg: "Job posted successfully", job: newJob });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
