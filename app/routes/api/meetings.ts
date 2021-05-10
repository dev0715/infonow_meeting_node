import express from "express";
const router = express.Router();
import { MeetingsCtrl } from "../../controllers";
import { UUID_REGEX_ROUTE } from "../../utils/validators";

router.get(`/:meetingId(${UUID_REGEX_ROUTE})`, MeetingsCtrl.getMeeting);
router.post("/", MeetingsCtrl.newMeeting);
router.put(
	`/:meetingId(${UUID_REGEX_ROUTE})/:type(accepted|rejected)`,
	MeetingsCtrl.acceptOrRejectMeeting
);
router.put(
	`/:meetingId(${UUID_REGEX_ROUTE})/:type(cancelled|rescheduled)`,
	MeetingsCtrl.cancelOrRescheduleMeeting
);

export default router;
