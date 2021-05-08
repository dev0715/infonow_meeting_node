import express from "express";
import { MeetingsCtrl } from "../../controllers";

const router = express.Router();

router.get("/:userId/meetings", MeetingsCtrl.getAllUserMeetings);

export default router;
