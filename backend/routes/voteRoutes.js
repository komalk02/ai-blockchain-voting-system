const express = require("express");

const router = express.Router();

const Vote = require("../models/Vote");

const User = require("../models/User");

const {
    Blockchain,
    Block
} = require("../blockchain");

const votingChain = new Blockchain();

router.post("/vote", async (req, res) => {

    try {

        const { voterId, candidate } = req.body;

        console.log(voterId, candidate);

        const user = await User.findById(voterId);

        if(!user){

            return res.status(404).json({
                message: "User not found"
            });

        }

        if(user.hasVoted){

            return res.status(400).json({
                message: "You already voted"
            });

        }

        const vote = new Vote({

            voterId,
            candidate

        });

        await vote.save();

        const block = new Block(

            votingChain.chain.length,

            Date.now(),

            {
                voterId,
                candidate
            }

        );

        votingChain.addBlock(block);

        console.log(votingChain.chain);

        user.hasVoted = true;

        await user.save();

        res.json({
            message: "Vote Cast Successfully"
        });

    } catch(err){

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }

});

router.get("/results", async (req, res) => {

    try {

        const votes = await Vote.find();

        res.json(votes);

    } catch(err){

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;