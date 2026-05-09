const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({

    voterId: String,

    candidate: String,

    timestamp: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Vote", VoteSchema);