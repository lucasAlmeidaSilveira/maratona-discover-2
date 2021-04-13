const Database = require("../db/config");

module.exports = {
    async get() {
        const db = await Database();

        const jobs = await db.all(`SELECT * FROM jobs`);

        await db.close();

        return jobs.map((job) => ({
            id: job.id,
            name: job.name,
            "daily-hours": job.daily_hours,
            "total-hours": job.total_hours,
            createdAt: job.created_at,
        })); // aqui seria necessário o returnar esse objeto, mas como não há funções dentro dessa função (como if), coloca-se o parentese antes de abrir a chave {} e retira o return
    },

    update(newJob) {
        data = newJob;
    },

    delete(id) {
        data = data.filter((job) => Number(job.id) !== Number(id)); // quando true, ele mantem no array */
    },

    async create(newJob) {
      const db = await Database()

      await db.run(`INSERT INTO jobs (
        name,
        daily_hours,
        total_hours,
        created_at
      ) VALUES (
        "${newJob.name}",
        ${newJob["daily-hours"]},
        ${newJob["total-hours"]},
        ${newJob["createdAt"]}
      )`)

      db.close()
    },
};
