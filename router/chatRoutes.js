import express from "express"
import { accessChat, fetchChats } from "../controller/chatController.js";
import { authenticated } from "../middleware/auth.js";
const router = express.Router();
router.post("/createChat", authenticated, accessChat);
router.get("/fetchChats", authenticated, fetchChats);
export default router