const express = require("express");
const routes = express.Router();

const views = __dirname + '/views/'

const profile = {
  name: "Lucas",
  avatar: "https://avatars.githubusercontent.com/u/72694905?v=4",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4
}

const jobs = []

// request, response
routes.get("/", (req, res) => res.render(views + "index", {profile}));
routes.get("/job", (req, res) => res.render(views + "job"));

routes.post("/job", (req, res) => {
  // req.body = { name: 'dawd', 'daily-hours': '3', 'total-hours': '32' }
  // const ladtId = jobs[jobs.length - 1]?.id || 1  => algoritmo da aula

  jobs.push({
    id: jobs.length + 1,
    name: req.body.name,
    'daily-hours': req.body["daily-hours"],
    'total-hours': req.body["total-hours"],
    createdAt: Date.now() // atribuindo data de hoje
  })
  console.log(jobs)
  return res.redirect('/')
});

routes.get("/job/edit", (req, res) => res.render(views + "job-edit"));
routes.get("/profile", (req, res) => res.render(views + "profile", {profile}));

module.exports = routes;