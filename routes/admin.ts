import express from "express";
import controllers from "../controllers/admin.js";
const router = express
    .Router()
    .post(`/createServices`, controllers.createServices)
    .get(`/getServices`, controllers.getServices)
    .delete(`/deleteServices/:id`, controllers.deleteServices)
    .put(`/updateServices/:id`, controllers.updateServices)

export default router;