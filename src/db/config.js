const sqlite3 = require("sqlite3");
const { open } = require("sqlite"); // buscando somente a funcionalidade OPEN do sqlite

// configurar o open
// é necessário exportar o open dessa forma quando retirado do sqlite
module.exports = () =>
    open({
        filename: "./database.sqlite",
        driver: sqlite3.Database,
    });

// para chamar o open, nós precisamos apenas chamar o "config", assim, iniciando a conexão com o banco de dados
