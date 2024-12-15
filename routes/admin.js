const controllers = require("../controllers/admin.js");
module.exports = require("express")
    .Router()
    .post(`/createServices`, controllers.createServices)
    .get(`/getServices`, controllers.getServices)