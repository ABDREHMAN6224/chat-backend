import express from "express"
import { allMessages, sendMessage } from "../controller/messageController.js";
import { authenticated } from "../middleware/auth.js";
const router = express.Router();

router.get("/allMessages/:chatId", allMessages)
router.post("/sendMessage", authenticated, sendMessage)

export default router;