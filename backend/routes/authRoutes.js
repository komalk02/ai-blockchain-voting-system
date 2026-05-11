const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// ================= REGISTER =================

router.post("/register", async (req, res) => {

   try {

      const {
         name,
         email,
         password,
         faceDescriptor
      } = req.body;

      const existingUser =
      await User.findOne({ email });

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
         message: "Registration successful"
      });

   } catch(err){

      console.log(err);

      res.status(500).json({
         message: "Server error"
      });

   }

});


// ================= LOGIN =================

router.post("/login", async (req, res) => {

   try {

      const {
         email,
         password
      } = req.body;

      const user =
      await User.findOne({ email });

      if(!user){

         return res.status(400).json({
            message: "User not found"
         });

      }

      const validPassword =
      await bcrypt.compare(
         password,
         user.password
      );

      if(!validPassword){

         return res.status(400).json({
            message: "Invalid password"
         });

      }

      const token = jwt.sign(

         {
            id: user._id
         },

         process.env.JWT_SECRET,

         {
            expiresIn: "1d"
         }

      );

      res.json({

         token,

         user: {
            id: user._id,
            name: user.name,
            email: user.email
         }

      });

   } catch(err){

      console.log(err);

      res.status(500).json({
         message: "Server error"
      });

   }

});

module.exports = router;