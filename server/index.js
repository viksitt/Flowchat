const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 4500;
const users = {};

// Setup CORS
app.use(cors());
app.use(express.static("uploads")); // Serve uploaded files statically

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });

// File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `http://localhost:4500/${req.file.filename}`;
    res.json({ fileUrl });
});

// Handle Socket.io Connections
io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    socket.on('joined', ({ user }) => {
        users[socket.id] = user;
        socket.broadcast.emit('userJoined', { user: "Admin", message: `${user} has joined` });
        socket.emit('welcome', { user: "Admin", message: `Welcome to the chat , ${user}` });
    });

    socket.on('message', ({ message }) => {
        io.emit('sendMessage', { user: users[socket.id], message, id: socket.id });
    });

    // Handle file sharing
    socket.on('sendFile', ({ fileUrl, fileName }) => {
        io.emit('receiveFile', { user: users[socket.id], fileUrl, fileName, id: socket.id });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', { user: "Admin", message: `${users[socket.id]} has left` });
        delete users[socket.id];
    });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
