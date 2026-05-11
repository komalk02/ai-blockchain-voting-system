const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: false
    },

    hasVoted: {
        type: Boolean,
        default: false
    },

    faceDescriptor: {
        type: Array,
        default: []
    }

});

module.exports = mongoose.model("User", UserSchema);