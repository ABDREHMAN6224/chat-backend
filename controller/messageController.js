import asyncHandler from "express-async-handler"
import Message from "../model/message.js"
import Chat from "../model/chatModel.js"

export const sendMessage = asyncHandler(async (req, res) => {
    const { chatId, message: content, type } = req.body;
    if (!content || !chatId) {
        return res.status(400).json({ err: "error" })
    }
    console.log(req.user._id);
    const msg = {
        author: req.user._id,
        message: content,
        chat: chatId,
        type: type
    }
    try {
        let created = await Message.create(msg)

        await Chat.findByIdAndUpdate(chatId, { recentMessage: created }, { new: true })
        created = await Message.findOne({ _id: created._id }).populate("author", "name")
            .populate({
                path: "chat",
                populate: {
                    path: "members",
                    select: "name"
                }
            })
        return res.status(200).json(created)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ err: "error" })

    }
})

export const allMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    if (chatId !== "undefined") {
        const foundChat = await Message.find({ chat: chatId })
            .populate("author", "-password")
            .populate({
                path: "chat",
                populate: {
                    path: "members",
                    select: "name picturePath email"
                }
            })
        return res.json(foundChat)
    }
    else {
        return res.json([])
    }
})
