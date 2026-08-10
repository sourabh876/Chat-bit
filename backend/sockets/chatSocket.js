const Message = require("../models/Message");

// Store currently connected users
const onlineUsers = new Map();

const setupChatSocket = (io) => {

    io.on("connection", (socket) => {

        console.log(
            `User connected: ${socket.id}`
        );


        
        // JOIN CHAT
        

        socket.on("join_chat", (username) => {

            if (
                !username ||
                !username.trim()
            ) {
                return;
            }

            const cleanUsername =
                username.trim();


            onlineUsers.set(
                socket.id,
                {
                    socketId: socket.id,
                    username: cleanUsername
                }
            );


            console.log(
                `${cleanUsername} joined the chat`
            );


            io.emit(
                "online_users",
                Array.from(
                    onlineUsers.values()
                )
            );

        });


        
        // SEND MESSAGE
        

        socket.on(
            "send_message",
            async (data) => {

                try {

                    const {
                        username,
                        text
                    } = data;


                    // Validation
                    if (
                        !username ||
                        !username.trim()
                    ) {

                        socket.emit(
                            "message_error",
                            {
                                message:
                                    "Username is required"
                            }
                        );

                        return;
                    }


                    if (
                        !text ||
                        !text.trim()
                    ) {

                        socket.emit(
                            "message_error",
                            {
                                message:
                                    "Message text is required"
                            }
                        );

                        return;
                    }


                    // Create message
                    const message =
                        await Message.create({

                            username:
                                username.trim(),

                            text:
                                text.trim(),

                            status: "sent"

                        });


                    // Send message to sender
                    socket.emit(
                        "message_sent",
                        message
                    );


                    // Send message to other users
                    socket.broadcast.emit(
                        "new_message",
                        message
                    );


                } catch (error) {

                    console.error(
                        "Send message error:",
                        error.message
                    );


                    socket.emit(
                        "message_error",
                        {
                            message:
                                "Failed to send message"
                        }
                    );

                }

            }
        );


        
        // MESSAGE DELIVERED
        

        socket.on(
            "message_delivered",
            async (messageId) => {

                try {

                    if (!messageId) {
                        return;
                    }


                    const message =
                        await Message.findByIdAndUpdate(
                            messageId,
                            {
                                status: "delivered"
                            },
                            {
                                new: true
                            }
                        );


                    if (!message) {

                        console.log(
                            "Message not found:",
                            messageId
                        );

                        return;
                    }


                    console.log(
                        `Message delivered: ${messageId}`
                    );


                    // Notify everyone about status update
                    io.emit(
                        "message_delivered",
                        message
                    );


                } catch (error) {

                    console.error(
                        "Message delivery error:",
                        error.message
                    );

                }

            }
        );


        
        // MESSAGE READ
        

        socket.on(
            "message_read",
            async (messageId) => {

                try {

                    if (!messageId) {
                        return;
                    }


                    const message =
                        await Message.findByIdAndUpdate(
                            messageId,
                            {
                                status: "read"
                            },
                            {
                                new: true
                            }
                        );


                    if (!message) {

                        console.log(
                            "Message not found:",
                            messageId
                        );

                        return;
                    }


                    console.log(
                        `Message read: ${messageId}`
                    );


                    io.emit(
                        "message_read",
                        message
                    );


                } catch (error) {

                    console.error(
                        "Message read error:",
                        error.message
                    );

                }

            }
        );


        
        // TYPING
        

        socket.on(
            "typing",
            (username) => {

                if (!username) {
                    return;
                }


                socket.broadcast.emit(
                    "user_typing",
                    username
                );

            }
        );


        
        // STOP TYPING
        

        socket.on(
            "stop_typing",
            (username) => {

                if (!username) {
                    return;
                }


                socket.broadcast.emit(
                    "user_stopped_typing",
                    username
                );

            }
        );


        
        // DISCONNECT
        

        socket.on(
            "disconnect",
            () => {

                const user =
                    onlineUsers.get(
                        socket.id
                    );


                if (user) {

                    console.log(
                        `${user.username} disconnected`
                    );


                    onlineUsers.delete(
                        socket.id
                    );


                    io.emit(
                        "online_users",
                        Array.from(
                            onlineUsers.values()
                        )
                    );


                    io.emit(
                        "user_offline",
                        user.username
                    );

                } else {

                    console.log(
                        `Socket disconnected: ${socket.id}`
                    );

                }

            }
        );

    });

};


module.exports = setupChatSocket;