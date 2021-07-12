import express from "express";
const router = express.Router();
import { MeetingsCtrl } from "../../controllers";
import { UUID_REGEX_ROUTE } from "../../../sequelize/utils/validators";

router.get(`/:meetingId(${UUID_REGEX_ROUTE})`, MeetingsCtrl.getMeeting);
router.post("/", MeetingsCtrl.newMeeting);
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

export default router;
