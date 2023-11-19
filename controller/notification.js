import asyncHandler from "express-async-handler"
import Notification from "../model/notificationModel.js";
export const pushNotification = asyncHandler(async (req, res) => {
    try {
        const { userId: user, authorId: author, chatId: chat } = req.body;
        const notification = await Notification.create({ author, chat, user })
        const found = await Notification.findById(notification._id).populate("author", "-password").populate("chat")
        res.status(200).json(found)
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Some error has occured" })
    }
})
export const popNotification = asyncHandler(async (req, res) => {
    try {
        const { chatId } = req.body;
        const userId = req.user._id;
        const not = await Notification.deleteMany({ chat: chatId })
        const found = await Notification.find({ user: userId }).populate("chat").populate("author")
        res.status(200).json(found);
    } catch (error) {
        console.log(error);
        res.status(404).json({ err: "Some error has occured" })
    }
})
export const getAllNotifications = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const found = await Notification.find({ user: userId }).populate("chat").populate("author")
        res.status(200).json(found);
    } catch (error) {
        console.log(error);
        res.status(404).json({ err: "Some error has occured" })

    }
})