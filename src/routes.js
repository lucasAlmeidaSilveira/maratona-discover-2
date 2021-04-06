const express = require("express");
const routes = express.Router();

const views = __dirname + "/views/";

const Profile = {
  data: {
    name: "Lucas",
    avatar: "https://avatars.githubusercontent.com/u/72694905?v=4",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 75,
  },
  controllers: {
    index(req,res){
      return res.render(views + "profile", { profile: Profile.data })
    },
    update(req,res){
      // req.body para pegar os dados
      const data = req.body
      // definir quantas semanas tem no ano
      const weeksPerYear = 52
      // remover as semanas de férias do ano, para pegar quantas semanas tem em 1 mês
      const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12
      // total de horas trabalhadas na semana
      const weekTotalHours = data["days-per-week"] * data["hours-per-day"]
      // total de horas trabalhadas no mês
      const monthlyTotalHours = weekTotalHours * weeksPerMonth

    }
  }
};

const Jobs = {
  data: [
    {
      id: 1,
      name: "Pizzaria Guloso",
      "daily-hours": 2,
      "total-hours": 1,
      createdAt: Date.now(),
    },
    {
      id: 2,
      name: "OneTwo Projet",
      "daily-hours": 3,
      "total-hours": 47,
      createdAt: Date.now(),
    },
  ],

  controllers: {
    index(req, res) {
      const updatedJobs = Jobs.data.map((job) => {
        // ajustes no job
        const remaining = Jobs.services.remainingDays(job);
        const status = remaining <= 0 ? "done" : "progress";

        return {
          ...job,
          remaining,
          status,
          budget: Profile.data["value-hour"] * job["total-hours"],
        };
      });

      return res.render(views + "index", { profile: Profile.data, jobs: updatedJobs });
    },

    create(req, res) {
      return res.render(views + "job");
    },

    save(req, res) {
      // req.body = { name: 'dawd', 'daily-hours': '3', 'total-hours': '32' }
      // const ladtId = jobs[jobs.length - 1]?.id || 1  => algoritmo da aula

      Jobs.data.push({
        id: Jobs.data.length + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        createdAt: Date.now(), // atribuindo data de hoje
      });
      return res.redirect("/");
    },
  },

  services: {
    remainingDays(job) {
      // calculo de tempo restante
      const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed(); // cálculo dos dias restantes

      const createdDate = new Date(job.createdAt);

      const dueDay = createdDate.getDate() + Number(remainingDays); // dia da entrega do projeto
      const dueDateInMs = createdDate.setDate(dueDay);

      const timeDiffInMs = dueDateInMs - Date.now();
      // transformar millisegundos em dias
      const dayInMs = 1000 * 60 * 60 * 24;
      const dayDiff = Math.floor(timeDiffInMs / dayInMs);

      // restam x dias
      return dayDiff;
    },
  },
};

// request, response
routes.get("/", Jobs.controllers.index);

routes.get("/job", Jobs.controllers.create);
routes.post("/job", Jobs.controllers.save);

routes.get("/job/edit", (req, res) => res.render(views + "job-edit"));
routes.get("/profile", Profile.controllers.index);
routes.post("/profile", Profile.controllers.update);

module.exports = routes;
