import express from "express";
import UsersRouter from "./users";
import MeetingsRouter from "./meetings";
import { AuthorizeUtil } from "../../../sequelize/middlewares/auth/auth";

const router = express.Router();

router.use("/users", AuthorizeUtil.AuthorizeUser, UsersRouter);
router.use("/meetings", AuthorizeUtil.AuthorizeUser, MeetingsRouter);

export default router;
