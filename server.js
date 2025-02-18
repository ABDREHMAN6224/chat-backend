import dotenv from "dotenv"
import express from "express"
import bodyParser from "body-parser";
import cors from "cors"
import { fileURLToPath } from "url";
import path from "path";
import connection from "./connection/db.js";
import { uploadFile } from "./controller/fileUpload.js";
import { upload } from "./upload.js";
import authRoutes from "./router/auth.js"
import chatRoutes from "./router/chatRoutes.js"
import messageRoutes from "./router/messageRoutes.js"
import notificationRouter from "./router/notificationRoutes.js"
import { Server } from "socket.io";


dotenv.config()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express();
app.use(cors({
    origin:["https://archats-arm.netlify.app","http://localhost:5173"],
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public/")))

app.post("/fileupload", upload.single("file"), uploadFile)

app.use("/auth", authRoutes);
app.use("/chats", chatRoutes);
app.use("/chat", messageRoutes);
app.use("/notification", notificationRouter)

connection();
const port = process.env.PORT || 3000;

const server = app.listen(port, "0.0.0.0", () => {
    console.log("server started on port 3000");
})
const io = new Server(server, {
    cors: {
        origin: "https://archats-arm.netlify.app"
    }
});
var onlineUsers = [];
io.on("connection", (socket) => {
    socket.on('setup', (user) => {
        console.log(user._id);
        socket.join(user._id);
        onlineUsers.push[user];
        socket.id = user._id;
        console.log("socket id ", socket.id);
        socket.emit("online", onlineUsers)
    })
    socket.on('join chat', (chat) => {
        socket.join(chat.chat._id);
    })
    socket.on('new_message', (message) => {
        let chat = message.chat;
        if (!chat.members) {
            return console.log("error");
        }
        chat.members.forEach(user => {
            if (user._id == message.msg.author._id) return;
            socket.in(user._id).emit("message recieved", { message: message.msg, author: user._id });
        })
    })
    socket.on('new chat', (user, author) => {
        socket.in(user._id).emit("chat created");
        socket.in(author._id).emit("chat created");
    })
    socket.on('start typing', (chat, user) => {
        chat.members.map(m => {
            if (m._id !== user._id) {
                socket.in(m._id).emit("started", chat)
            }
        })
    })
    socket.on('stop typing', (chat, user) => {
        if (chat && user) {
            chat?.members?.map(m => {
                if (m._id !== user._id) {
                    socket.in(m._id).emit("stopped", chat)
                }
            })
        }
    })
    socket.on("disconnect", () => {
        console.log("onlineUsers are ", onlineUsers);
        onlineUsers = onlineUsers.filter(u => u._id !== socket.id)
        console.log("after onlineUsers are ", onlineUsers);
        socket.emit("online", onlineUsers)
    })
})