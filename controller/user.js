import expressAsyncHandler from "express-async-handler"
import User from "../model/userModel.js";

export const getUser = expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const found = await User.findById(userId).populate("friends", "name picturePath")
    res.status(200).json(found)
})

export const RegisterUser = expressAsyncHandler(async (req, res) => {
    try {
        const { name, email, password, picturePath } = req.body;
        console.log(req.body);

        const alreadyExists = await User.findOne({ email: email })
        if (alreadyExists) {
            throw new Error("Email already in use! ")
        }
        try {
            const createdUser = await User.create({ name, email, password, picturePath });
            const user = await User.findById(createdUser._id)
            user.generateToken()
            res.status(200).json(user)
        } catch (error) {
            throw new Error("Failed to create new User")
        }

    } catch (error) {
        return res.status(500).json({ err: err.message })
    }
})

export const LoginUser = expressAsyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const found = await User.findOne({ email })
        if (found) {
            if (found.matchPassword(password)) {
                found.generateToken()
                res.status(200).json(found)
            } else {
                throw new Error("Invalid Password")
            }
        }
        else {
            throw new Error("No such user... please register first")
        }

    } catch (error) {
        console.log(error.message);
        res.status(404).json({ msg: error.message })

    }
})
export const AllUsers = expressAsyncHandler(async (req, res) => {
    try {
        const users = await User.find({}).select("name picturePath");
        res.status(200).json(users)
    } catch (error) {
        res.status(404).json({ err: "No Users found" })
    }
})