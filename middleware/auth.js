import expressAsyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import User from "../model/userModel.js"

export const authenticated = expressAsyncHandler(async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (token.slice(0, 7) !== "Bearer ") {
            throw new Error("Invalid Request")
        }
        token = token.slice(7);
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        if (verified) {
            const user = await User.findById(verified.id);
            req.user = user;
            req.token = token;
            next();
        } else {
            throw new Error("Please Login First")
        }
    } catch (error) {
        res.status(404).json({ err: error.message })
    }
})