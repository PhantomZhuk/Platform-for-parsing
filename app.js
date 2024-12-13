const express = require("express");
const app = express();
dotenv = require("dotenv");
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get(`/`, (req, res) =>{
    res.sendFile(__dirname + "/public/pages/index.html");
})

app.get(`/admin`, (req, res) =>{
    res.sendFile(__dirname + "/public/pages/admin.html");
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})