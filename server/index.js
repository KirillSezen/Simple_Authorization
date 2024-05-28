require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRoutes");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

app.use("/", authRouter);
const  start = async () => {
    try{
        await mongoose.connect("mongodb://localhost:27017");
        app.listen(PORT, console.log("Сервер запущен на 5000 порту"));
    } catch(e) {
        console.log(e);
        
    }
};

start();