const controllers = require("../controllers/api.js");
module.exports = require("express")
    .Router()
    .post(`/getProductsFromSearch`, controllers.getProductsFromSearch)
    .get(`/getRandomProducts`, controllers.getRandomProducts)
