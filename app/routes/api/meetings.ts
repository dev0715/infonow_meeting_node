import express from "express";
const router = express.Router();
import { MeetingsCtrl } from "../../controllers";
import { UUID_REGEX_ROUTE } from "../../../sequelize/utils/validators";

router.post("/", MeetingsCtrl.newMeeting);

router.post("/admin-meeting", MeetingsCtrl.newAdminMeeting);

router.get(`/:meetingId(${UUID_REGEX_ROUTE})`, MeetingsCtrl.getMeeting);

router.put(
	`/:meetingId(${UUID_REGEX_ROUTE})/:type(accepted|rejected|rescheduled)`,
	MeetingsCtrl.acceptOrRejectOrRescheduleMeeting
);
router.put(
	`/:meetingId(${UUID_REGEX_ROUTE})/cancelled`,
	MeetingsCtrl.cancelMeeting
);

router.get(
	`/check-dates/:guest(${UUID_REGEX_ROUTE})`,
	MeetingsCtrl.getUsersMeetingDates
);

router.post("/feedback", MeetingsCtrl.newMeetingFeedback);

export default router;
