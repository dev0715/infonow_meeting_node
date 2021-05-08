import express from "express";
import { MeetingsCtrl } from "../../controllers";

const router = express.Router();

router.get("/meetings/:userId", MeetingsCtrl.getAllMeetings);

export default router;
