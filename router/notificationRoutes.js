import express from "express"
import { authenticated } from "../middleware/auth.js"
import { getAllNotifications, popNotification, pushNotification } from "../controller/notification.js"

const router = express.Router()
router.get("/all", authenticated, getAllNotifications)
router.post("/delete", authenticated, popNotification)
router.post("/add", pushNotification)
export default router