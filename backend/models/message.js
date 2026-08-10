const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            maxlength: 30
        },

        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },

        status: {
            type: String,
            enum: ["sent", "delivered", "read"],
            default: "sent"
        }
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model(
    "Message",
    messageSchema
);

module.exports = Message;