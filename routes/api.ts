import controllers  from "../controllers/api.js";
import express from "express";
const router = express
    .Router()
    .post(`/getProductsFromSearch`, controllers.getProductsFromSearch)
    .get(`/getRandomProducts`, controllers.getRandomProducts)

export default router;