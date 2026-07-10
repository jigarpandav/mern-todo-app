const userModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message: "Please provide all required fields"});
        }
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({name, email, password: hashedPassword });
        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });
    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Please provide all required fields"});
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid email or password"});
        }
        const token = jwt.sign(
            {
                id:user._id
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "User logged in successfully",
            user_id: user._id,
            token
        });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = {registerUser, loginUser};