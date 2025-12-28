import { Request, Response } from "express";
import { db } from "../db";
import { jobs, applications } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { sendAdminNotification } from "../utils/email";


export const getJobs = async (req: Request, res: Response) => {
    try {
        const allJobs = await db.select().from(jobs).where(eq(jobs.isActive, "true")).orderBy(desc(jobs.createdAt));
        res.json(allJobs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
};

export const createJob = async (req: Request, res: Response) => {
    try {
        const productData = req.body;
        const newJob = await db.insert(jobs).values(productData).returning();
        res.json(newJob[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create job" });
    }
};

export const deleteJob = async (req: Request, res: Response) => {
    try {
        await db.delete(jobs).where(eq(jobs.id, Number(req.params.id)));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete job" });
    }
};

export const applyToJob = async (req: Request, res: Response) => {
    try {
        const appData = req.body;
        const newApp = await db.insert(applications).values({
            ...appData,
            job_id: appData.job_id ? Number(appData.job_id) : null
        }).returning();

        // Notify Admin
        await sendAdminNotification(
            "New Job Application Received",
            `<h3>New Application from ${appData.name}</h3>
             <p><strong>Email:</strong> ${appData.email}</p>
             <p><strong>Message:</strong> ${appData.message || "No message"}</p>
             <p><a href="${appData.cv_url}">View CV</a></p>`
        );

        res.json(newApp[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit application" });
    }
};

export const getApplications = async (req: Request, res: Response) => {
    try {
        const allApps = await db.select({
            id: applications.id,
            name: applications.name,
            email: applications.email,
            phone: applications.phone,
            cv_url: applications.cv_url,
            message: applications.message,
            linkedin_url: applications.linkedin_url,
            portfolio_url: applications.portfolio_url,
            experience_years: applications.experience_years,
            expected_salary: applications.expected_salary,
            graduation_year: applications.graduation_year,
            status: applications.status,
            createdAt: applications.createdAt,
            jobTitle: jobs.title
        })
            .from(applications)
            .leftJoin(jobs, eq(applications.job_id, jobs.id))
            .orderBy(desc(applications.createdAt));

        res.json(allApps);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        await db.update(applications).set({ status }).where(eq(applications.id, Number(req.params.id)));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to update application status" });
    }
};
