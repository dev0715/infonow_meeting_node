import express from "express";
import { MeetingsCtrl } from "../../controllers";

import { UUID_REGEX_ROUTE } from "../../../sequelize/utils/validators";
import { AuthorizeUtil } from "../../../sequelize/middlewares/auth/auth";
const router = express.Router();

router.get("/authenticate", MeetingsCtrl.getMeetingToken);

router.get(
	`/:userId(${UUID_REGEX_ROUTE})/meetings`,
	AuthorizeUtil.AuthorizeAccessIfAdminOrSuperAdminOnly,
	MeetingsCtrl.getAllUserMeetings
);

export default router;
