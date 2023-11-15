import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        required: true,
        trim: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    recentMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
}, { timestamps: true })

const Chat = new mongoose.model("Chat", chatSchema)
export default Chat