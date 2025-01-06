import controllers from "../controllers/api.js";
import multer from "multer"; 
import express from "express";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

const router = express
    .Router()
    .get(`/getRandomProducts`, controllers.getRandomProducts)
    .get(`/protected`, ...controllers.protected)
    .post(`/refreshToken`, controllers.refreshToken)
    .get(`/getUserInfo`, controllers.getUserInfo)
    // .post(`/getProductsFromSearch`, controllers.getProductsFromSearch)
    .post(`/fetchProductFromServices`, controllers.fetchProductFromServices)
    .post(`/addServiceVisit`, controllers.addVisit)
    .post(`/signIn`, controllers.signIn)
    .post(`/signUp`, controllers.signUp)
    .post(`/mailConfirmation`, controllers.mailConfirmation)
    .post(`/logOut`, controllers.logout)
    .post(`/addTraceableProduct` , controllers.addTraceableProduct)
    .post(`/updateUserInfo`, upload.single('photo'), controllers.updateUserInfo)
    .delete(`/deleteUser`, controllers.deleteUser)
    .post(`/getProductByUrl`, controllers.getProductsByUrl)
    .post(`/deleteTraceableProduct`, controllers.deleteTraceableProduct)
    .post(`/getProductInfoByUrl`, controllers.getProductInfoByUrl);

export default router;