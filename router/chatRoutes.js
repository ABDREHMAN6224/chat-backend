import express from "express"
import { accessChat } from "../controller/chatController.js";
import { authenticated } from "../middleware/auth.js";
const router = express.Router();
router.post("/createChat", authenticated, accessChat);
export default router