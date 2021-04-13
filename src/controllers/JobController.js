const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
    create(req, res) {
        return res.render("job");
    },

    async save(req, res) {
        // const jobs = await Job.get();
        // req.body = { name: 'dawd', 'daily-hours': '3', 'total-hours': '32' }
        // const lastId = jobs[jobs.length - 1]?.id || 0; // algoritmo da aula

        await Job.create({
            // id: lastId + 1,
            name: req.body.name,
            "daily-hours": req.body["daily-hours"],
            "total-hours": req.body["total-hours"],
            createdAt: Date.now(), // atribuindo data de hoje
        });

        return res.redirect("/");
    },

    async show(req, res) {
        const jobs = await Job.get();
        const jobId = req.params.id;

        const job = jobs.find((job) => job.id == jobId);

        if (!job) {
            return res.send("Job not found");
        }

        const profile = await Profile.get();

        job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);

        return res.render("job-edit", { job });
    },

    async update(req, res) {
        const jobId = req.params.id;

        const updatedJob = {
            name: req.body.name,
            "total-hours": req.body["total-hours"],
            "daily-hours": req.body["daily-hours"],
        };

        await Job.update(updatedJob, jobId);

        res.redirect("/job/" + jobId);
    },

    async delete(req, res) {
        const jobId = req.params.id;
        await Job.delete(jobId);

        res.redirect("/");
    },
};
