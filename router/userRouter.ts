import { Router } from "express";
import { createUser } from "../controller/userController";

const router: Router = Router();

router.route("/create-user").post(createUser);
router.route("/verify-user").patch(createUser);

export default router;
