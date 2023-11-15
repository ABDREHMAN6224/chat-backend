import express from "express";
import { AllUsers, LoginUser, RegisterUser, getUser } from "../controller/user.js"
import { upload } from "../upload.js"

const router = express.Router();
router.post("/login", LoginUser)
router.post("/register", RegisterUser)
router.get("/allUsers", AllUsers)
router.get("/getUser/:userId", getUser)
export default router