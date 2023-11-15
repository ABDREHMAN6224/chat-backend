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
import { Server } from "socket.io";


dotenv.config()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public/")))
app.post("/fileupload", upload.single("file"), uploadFile)

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/chat", messageRoutes);

connection();
const port = process.env.PORT || 3000;

const server = app.listen(port, "0.0.0.0", () => {
    console.log("server started on port 3000");
})
const io = new Server(server, {
    cors: {
        origin: "https://archats-arm.netlify.app",
    }
});
let users = [];
io.on("connection", (socket) => {
    socket.on('setup', (user) => {
        socket.join(user._id);
        users.push(user._id)
        users = [...new Set(users)];
        socket.emit("connected", users);
    })
    socket.on('join chat', (chat_id) => {
        socket.join(chat_id);
    })
    socket.on('new_message', (message) => {
        let chat = message.chat;
        if (!chat.members) {
            return console.log("error");
        }
        chat.members.forEach(user => {
            console.log("id:", user._id == message.msg.author._id);
            if (user._id == message.msg.author._id) return;
            socket.in(user._id).emit("message recieved", message.msg);
        })
    })
})