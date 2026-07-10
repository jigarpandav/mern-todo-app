const  express = require("express");
const userRouter = express.Router();
const multer = require("multer");
const upload = multer();

const {
    registerUser,
    loginUser
} = require("../controller/userController");

// user register
userRouter.post("/register", upload.none(), registerUser);

//login
userRouter.post("/login",upload.none(), loginUser);

module.exports = userRouter;