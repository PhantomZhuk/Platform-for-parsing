import express from "express";
import { fileURLToPath } from 'url';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express
    .Router()
    .get("/", (_, res) => {
        res.sendFile(path.join(__dirname, '/../public/pages/index.html'));
    })
    .get("/admin", (_, res) => {
        res.sendFile(path.join(__dirname, '/../public/pages/admin.html'));
    })

export default router;