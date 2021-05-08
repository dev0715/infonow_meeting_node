import express from "express";
const router = express.Router();
import { MeetingsCtrl } from "../../controllers";

router.get("/", MeetingsCtrl.getAllMeetings);
router.get("/:meetingId", MeetingsCtrl.getMeeting);
router.post("/", MeetingsCtrl.newMeeting);
router.put("/:meetingId", MeetingsCtrl.updateMeeting);

export default router;
