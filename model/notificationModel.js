import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }
}, { timestamps: true })

const Notification = new mongoose.model("Notification", notificationSchema)
export default Notification