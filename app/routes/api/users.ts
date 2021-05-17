import express from "express";
import { MeetingsCtrl } from "../../controllers";

import { UUID_REGEX_ROUTE } from "../../../sequelize/utils/validators";
const router = express.Router();

router.get(
	`/:userId(${UUID_REGEX_ROUTE})/meetings`,
	MeetingsCtrl.getAllUserMeetings
);

export default router;
