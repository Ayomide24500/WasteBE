import { Router } from "express";
import { createUser, getAllUser, logOut, signinAll, updateUserLocation, verifyUser } from "../controller/userController";

const router: Router = Router();

router.route('/create-user').post(createUser);
router.route('/create-user-location').post(updateUserLocation);
router.route("/sign-in").post(signinAll);
router.route("/verify").patch(verifyUser);
router.route("/logOut").get(logOut);
router.route("/reset-password").get(getAllUser);
router

export default router;

