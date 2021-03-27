const express = require("express");
const server = express();
const routes = require("./routes");

// ligar a template engine do EJS
server.set("view engine", 'ejs'); 

// habilitar arquivos estáticos
server.use(express.static("public"));

// routes
server.use(routes);
server.listen(3000, () => console.log("rodando"));
