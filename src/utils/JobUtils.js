module.exports = {
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
  calculateBudget: (job, valueHour) => valueHour * job["total-hours"],
}