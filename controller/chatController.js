import asyncHandler from "express-async-handler"
import Chat from "../model/chatModel.js"

export const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.log("no user id");
        return res.sendStatus(400)
    }
    var isChat = await Chat.find({
        $and: [
            { members: { $elemMatch: { $eq: req.user._id } } },
            { members: { $elemMatch: { $eq: userId } } }
        ]
    })
        .populate("members", "-password")
        .populate({
            path: 'recentMessage',
            populate: {
                path: 'author',
                select: 'name picturePath email'
            }
        })
    if (isChat.length) {
        res.send(isChat[0])
    } else {
        var chatData = {
            chatName: "sender",
            members: [req.user._id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("members", "-password")
                .populate({
                    path: 'recentMessage',
                    populate: {
                        path: 'author',
                        select: 'name picturePath email'
                    }
                })
            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error("error")
        }
    }


})


export const fetchChats = asyncHandler(async (req, res) => {
    try {
        const found = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate("users", "-password").populate({
            path: "latestMessage",
            populate: {
                path: "sender",
                select: "name pic email"
            }
        }).sort({ updatedAt: -1 })
        res.status(200).send(found)
    } catch (error) {

    }
})










