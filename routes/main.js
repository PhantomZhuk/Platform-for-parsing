module.exports = require("express")
    .Router()
    .get("/", (_, res) => res.sendFile("index.html", { root: __dirname + "/../public/pages" }))
    .get("/admin", (_, res) => res.sendFile("admin.html", { root: __dirname + "/../public/pages" }));
