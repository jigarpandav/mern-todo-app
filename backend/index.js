const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const userRouter = require("./router/userRouter");
const taskRouter = require("./router/taskRouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectDB();

app.use("/api",userRouter);
app.use("/api",taskRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log(`app is listening on port: http://localhost:${PORT}`)
})