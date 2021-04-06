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
      // qual valor da minha hora
      const valueHour = (data["monthly-budget"] / monthlyTotalHours)
      Profile.data = {
        ...Profile.data,
        ...req.body,
        "value-hour": valueHour
      }

      return res.redirect('/profile')

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
      createdAt: Date.now()
    },
    {
      id: 2,
      name: "OneTwo Projet",
      "daily-hours": 3,
      "total-hours": 47,
      createdAt: Date.now()
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
          budget: Jobs.services.calculateBudget(job, Profile.data["value-hour"])
        };
      });

      return res.render(views + "index", { profile: Profile.data, jobs: updatedJobs });
    },

    create(req, res) {
      return res.render(views + "job");
    },

    save(req, res) {
      // req.body = { name: 'dawd', 'daily-hours': '3', 'total-hours': '32' }
      const lastId = Jobs.data[Jobs.data.length - 1]?.id || 0 // algoritmo da aula

      Jobs.data.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        createdAt: Date.now(), // atribuindo data de hoje
      });
      return res.redirect("/");
    },

    show(req,res){

      const jobId = req.params.id
      const job = Jobs.data.find(job => job.id == jobId)

      if(!job){
        return res.send('Job not found')
      }

      job.budget = Jobs.services.calculateBudget(job, Profile.data["value-hour"])

      return res.render(views + "job-edit", { job })
    },

    update(req, res){
      const jobId = req.params.id
      const job = Jobs.data.find(job => job.id == jobId)

      if(!job){
        return res.send('Job not found')
      }

      const updatedJob = {
        ...job,
        name: req.body.name,
        "total-hours": req.body["total-hours"],
        "daily-hours": req.body["daily-hours"]
      }

      Jobs.data = Jobs.data.map(job =>{
        if(Number(job.id) === Number(jobId)){
          job = updatedJob
        }
        return job
      })

      res.redirect('/')
    },

    delete(req, res){
      const jobId = req.params.id

      Jobs.data = Jobs.data.filter( job => Number(job.id) !== Number(jobId) ) // quando true, ele mantem no array

      res.redirect('/')
    }
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
    calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
  },
};

// request, response
routes.get("/", Jobs.controllers.index);
routes.get("/job", Jobs.controllers.create);
routes.post("/job", Jobs.controllers.save);
routes.get("/job/:id", Jobs.controllers.show);
routes.post("/job/:id", Jobs.controllers.update);
routes.post("/job/delete/:id", Jobs.controllers.delete);
routes.get("/profile", Profile.controllers.index);
routes.post("/profile", Profile.controllers.update);

module.exports = routes;
