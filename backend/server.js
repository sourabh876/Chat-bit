const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"])

const connectDB = require("./config/db");
const messageRoutes = require("./routes/messageRoutes");
const setupChatSocket = require("./sockets/chatSocket");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"]
    }
});

app.use(
    cors({
        origin: process.env.CLIENT_URL
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Real-Time Chat API is running"
    });
});

app.use("/api/messages", messageRoutes);

setupChatSocket(io);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});