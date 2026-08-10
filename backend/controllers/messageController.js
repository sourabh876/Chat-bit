const Message = require("../models/Message");


// GET /api/messages
const getMessages = async (req, res) => {

    try {

        const messages = await Message
            .find()
            .sort({
                createdAt: 1
            })
            .limit(100);


        res.status(200).json({
            success: true,
            count: messages.length,
            messages
        });

    } catch (error) {

        console.error(
            "Get messages error:",
            error.message
        );


        res.status(500).json({
            success: false,
            message:
                "Failed to fetch chat history"
        });

    }

};


// POST /api/messages
const sendMessage = async (req, res) => {

    try {

        const {
            username,
            text
        } = req.body;


        if (
            !username ||
            !username.trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Username is required"
            });

        }


        if (
            !text ||
            !text.trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Message text is required"
            });

        }


        if (username.trim().length > 30) {

            return res.status(400).json({
                success: false,
                message:
                    "Username cannot exceed 30 characters"
            });

        }


        if (text.trim().length > 1000) {

            return res.status(400).json({
                success: false,
                message:
                    "Message cannot exceed 1000 characters"
            });

        }


        const message =
            await Message.create({

                username:
                    username.trim(),

                text:
                    text.trim(),

                status: "sent"

            });


        res.status(201).json({
            success: true,
            message
        });


    } catch (error) {

        console.error(
            "Send message error:",
            error.message
        );


        res.status(500).json({
            success: false,
            message:
                "Failed to send message"
        });

    }

};


module.exports = {
    getMessages,
    sendMessage
};