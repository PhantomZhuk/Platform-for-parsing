import controllers  from "../controllers/api.js";

import express from "express";
const router = express
    .Router()
    .post(`/getProductsFromSearch`, controllers.getProductsFromSearch)
    .get(`/getRandomProducts`, controllers.getRandomProducts)
    .post(`/fetchProductFromServices`, controllers.fetchProductFromServices)
    .post(`/addServiceVisit`, controllers.addVisit)
    .get(`/protected`, ...controllers.protected)
    .get(`/refreshToken`, controllers.refresh)
    .post(`/signIn`, controllers.signIn)
    .post(`/signUp`, controllers.signUp)
    .post(`/mailConfirmation`, controllers.mailConfirmation)

export default router;