const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            faceDescriptor
        } = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser){

            return res.status(400).json({
                message: "User already exists"
            });

        }

        let hashedPassword = "";

if(password){

    hashedPassword =
    await bcrypt.hash(password, 10);

}

        const user = new User({

            name,
            email,
            password: hashedPassword,
            faceDescriptor

        });

        await user.save();

        res.json({

   message: "User Registered Successfully",

   user

});

    } catch(err){

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }

});

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user){

            return res.status(400).json({
                message: "User not found"
            });

        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){

            return res.status(400).json({
                message: "Invalid credentials"
            });

        }

        const token = jwt.sign(
            { id: user._id },
            "SECRETKEY",
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user
        });

    } catch(err){

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }

});

router.post("/face-login", async (req, res) => {

    try {

        const { faceDescriptor } = req.body;

        const users = await User.find();

        let matchedUser = null;

        for(const user of users){

            if(
                JSON.stringify(user.faceDescriptor.slice(0,5)) ===
                JSON.stringify(faceDescriptor.slice(0,5))
            ){
                matchedUser = user;
                break;
            }

        }

        if(!matchedUser){

            return res.status(401).json({
                message: "Face not recognized"
            });

        }

        res.json({
            message: "Login Successful",
            user: matchedUser
        });

    } catch(err){

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;