import express from "express";
import UsersRouter from "./users";
import MeetingsRouter from "./meetings";

const router = express.Router();

router.use("/users", UsersRouter);
router.use("/meetings", MeetingsRouter);

export default router;
