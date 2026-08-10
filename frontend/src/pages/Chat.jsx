import { useEffect, useRef, useState } from "react";

import ChatHeader from "../components/ChatHeader";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";

import { getMessages } from "../services/api";
import { socket } from "../socket/socket";


const getMessageDate = (message) => {
    return new Date(
        message.createdAt ||
        message.timestamp ||
        message.created_at
    );
};


const isSameDay = (date1, date2) => {

    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );

};


const getDateLabel = (date) => {

    const today = new Date();

    const yesterday = new Date();

    yesterday.setDate(
        yesterday.getDate() - 1
    );


    if (isSameDay(date, today)) {
        return "Today";
    }


    if (isSameDay(date, yesterday)) {
        return "Yesterday";
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

};

const Chat = ({ username, onLogout }) => {

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [connected, setConnected] = useState(false);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const [typingUser, setTypingUser] = useState("");

    const messagesEndRef = useRef(null);

    const typingTimeoutRef = useRef(null);


    // Scroll to latest message
    const scrollToBottom = () => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    };


    // Load previous messages
    useEffect(() => {

        const loadMessages = async () => {

            try {

                setLoading(true);

                const data = await getMessages();

                setMessages(
                    data.messages || []
                );

            } catch (error) {

                console.error(
                    "Failed to load messages:",
                    error
                );

                setError(
                    "Unable to load chat history."
                );

            } finally {

                setLoading(false);

            }

        };

        loadMessages();

    }, []);


    // Socket.io
    useEffect(() => {

        const handleConnect = () => {

            console.log(
                "Socket connected:",
                socket.id
            );

            setConnected(true);


            // Tell server who joined
            socket.emit(
                "join_chat",
                username
            );

        };


        const handleDisconnect = (reason) => {

            console.log(
                "Socket disconnected:",
                reason
            );

            setConnected(false);

            setOnlineUsers([]);

        };

        const handleReconnect = () => {

            console.log(
                "Socket reconnected"
            );

            setConnected(true);

            socket.emit(
                "join_chat",
                username
            );

        };


        const handleNewMessage = (message) => {

            // First add the received message to the chat
            setMessages(
                (previousMessages) => [
                    ...previousMessages,
                    {
                        ...message,
                        status: "delivered"
                    }
                ]
            );

            // Tell the server that the message
            // has been delivered to this client
            socket.emit(
                "message_delivered",
                message._id
            );

        };


        const handleMessageError = (error) => {

            console.error(
                "Socket message error:",
                error
            );

            setError(
                error.message ||
                "Failed to send message."
            );

        };



        const handleMessageSent = (message) => {

            setMessages((previousMessages) => {

                const exists = previousMessages.some(
                    (item) => item._id === message._id
                );

                if (exists) {
                    return previousMessages;
                }

                return [
                    ...previousMessages,
                    message
                ];

            });

        };


        const handleMessageDelivered = (message) => {

            setMessages((previousMessages) => {

                return previousMessages.map(
                    (item) => {

                        if (item._id === message._id) {

                            return {
                                ...item,
                                status: message.status
                            };

                        }

                        return item;

                    }
                );

            });

        };


        const handleMessageRead = (message) => {

            setMessages((previousMessages) => {

                return previousMessages.map(
                    (item) => {

                        if (item._id === message._id) {

                            return {
                                ...item,
                                status: "read"
                            };

                        }

                        return item;

                    }
                );

            });

        };


        // Online users
        const handleOnlineUsers = (users) => {

            setOnlineUsers(users);

        };


        // User typing
        const handleUserTyping = (typingUsername) => {

            setTypingUser(
                typingUsername
            );

        };


        // User stopped typing
        const handleUserStoppedTyping = (
            stoppedUsername
        ) => {

            setTypingUser(
                (currentUser) =>
                    currentUser === stoppedUsername
                        ? ""
                        : currentUser
            );

        };


        // Register events
        socket.on(
            "connect",
            handleConnect
        );

        socket.on(
            "disconnect",
            handleDisconnect
        );

        socket.on(
            "reconnect",
            handleReconnect
        );

        socket.on(
            "new_message",
            handleNewMessage
        );

        socket.on(
            "message_error",
            handleMessageError
        );

        socket.on(
            "message_sent",
            handleMessageSent
        );

        socket.on(
            "message_delivered",
            handleMessageDelivered
        );

        socket.on(
            "message_read",
            handleMessageRead
        );

        socket.on(
            "online_users",
            handleOnlineUsers
        );

        socket.on(
            "user_typing",
            handleUserTyping
        );

        socket.on(
            "user_stopped_typing",
            handleUserStoppedTyping
        );


        // Connect
        socket.connect();


        // Cleanup
        return () => {

            socket.off(
                "connect",
                handleConnect
            );

            socket.off(
                "disconnect",
                handleDisconnect
            );

            socket.off(
                "reconnect",
                handleReconnect
            );

            socket.off(
                "new_message",
                handleNewMessage
            );

            socket.off(
                "message_error",
                handleMessageError
            );

            socket.off(
                "message_sent",
                handleMessageSent
            );

            socket.off(
                "message_delivered",
                handleMessageDelivered
            );

            socket.off(
                "message_read",
                handleMessageRead
            );

            socket.off(
                "online_users",
                handleOnlineUsers
            );

            socket.off(
                "user_typing",
                handleUserTyping
            );

            socket.off(
                "user_stopped_typing",
                handleUserStoppedTyping
            );

            socket.disconnect();

        };

    }, [username]);


    // Scroll when messages change
    useEffect(() => {

        scrollToBottom();

    }, [messages]);

    // Automatically mark received messages as read
    useEffect(() => {

        if (!connected) {
            return;
        }

        const unreadMessages = messages.filter(
            (message) =>
                message.username !== username &&
                message.status === "delivered"
        );

        unreadMessages.forEach(
            (message) => {

                socket.emit(
                    "message_read",
                    message._id
                );

            }
        );

    }, [
        messages,
        connected,
        username
    ]);


    // Send message
    const handleSendMessage = (text) => {

        if (!connected) {

            setError(
                "You are not connected to the server."
            );

            return;

        }


        socket.emit(
            "send_message",
            {
                username,
                text
            }
        );


        // Stop typing after sending
        socket.emit(
            "stop_typing",
            username
        );

    };


    // Handle typing
    const handleTyping = () => {

        if (!connected) {
            return;
        }


        socket.emit(
            "typing",
            username
        );


        // Clear previous timeout
        if (typingTimeoutRef.current) {

            clearTimeout(
                typingTimeoutRef.current
            );

        }


        // Stop typing after 1 second
        typingTimeoutRef.current =
            setTimeout(() => {

                socket.emit(
                    "stop_typing",
                    username
                );

            }, 1000);

    };

    const sortedMessages = [...messages].sort(
        (a, b) =>
            new Date(
                a.createdAt
            ) -
            new Date(
                b.createdAt
            )
    );


    if (loading) {

        return (
            <div className="loading-screen">
                Loading chat...
            </div>
        );

    }


    return (
        <div className="chat-page">

            <ChatHeader
                username={username}
                connected={connected}
                onlineUsers={onlineUsers}
                onLogout={onLogout}
            />


            {error && (

                <div className="error-message">

                    {error}

                    <button
                        onClick={() =>
                            setError("")
                        }
                    >
                        ×
                    </button>

                </div>

            )}


            <div className="online-users-bar">

                <strong>
                    Online:
                </strong>

                {onlineUsers.length === 0 ? (

                    <span>
                        No users online
                    </span>

                ) : (

                    onlineUsers.map((user) => (

                        <span
                            key={user.socketId}
                            className="online-user"
                        >
                            🟢 {user.username}
                        </span>

                    ))

                )}

            </div>


            <main className="messages-container">

                {messages.length === 0 ? (

                    <div className="empty-chat">

                        <h2>
                            No messages yet
                        </h2>

                        <p>
                            Start the conversation!
                        </p>

                    </div>

                ) : (

                    sortedMessages.map((message, index) => {

                        const messageDate =
                            getMessageDate(message);

                        const previousMessage =
                            messages[index - 1];

                        const previousDate =
                            previousMessage
                                ? getMessageDate(previousMessage)
                                : null;


                        const showDateSeparator =
                            !previousDate ||
                            !isSameDay(
                                messageDate,
                                previousDate
                            );


                        return (
                            <div
                                key={message._id}
                            >

                                {showDateSeparator && (
                                    <div className="date-separator">
                                        <span>
                                            {getDateLabel(
                                                messageDate
                                            )}
                                        </span>
                                    </div>
                                )}


                                <MessageBubble
                                    message={message}
                                    currentUsername={username} 
                                />

                            </div>
                        );

                    })

                )}


                {typingUser && (

                    <div className="typing-indicator">

                        {typingUser} is typing...

                    </div>

                )}


                <div
                    ref={messagesEndRef}
                />

            </main>


            <MessageInput
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
            />

        </div>
    );

};

export default Chat;