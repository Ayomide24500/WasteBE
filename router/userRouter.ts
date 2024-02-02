import { Router } from "express";
import {
  createAdmin,
  createClient,
  createLogistics,
  createVendor,
  getAll,
  getAllDealer,
  logOut,
  resetPassWord,
  signinAll,
  verifyAll,
} from "../controller/userController";
import validator from "../utils/validator";
import { passwordValidator, registerValidator } from "../utils/userValidator";
import { authRized } from "../utils/authorized";
import { authorization } from "../utils/authorization";

const router: Router = Router();

router.route("/create-client").post(createClient);
router.route("/create-Admin").post(validator(registerValidator), createAdmin);
router.route("/create-dispatcher").post(createLogistics);
router.route("/create-vendor").post(createVendor);
router.route("/sign-in").post(signinAll);
router.route("/get-All").get(authRized, getAll);
router.route("/get-Alls").get(authorization, getAllDealer);
router.route("/verify").patch(verifyAll);
router.route("/logOut").get(logOut);
router.route("/reset-password").patch(resetPassWord);
router
  .route("/change-password/userID")
  .patch(validator(passwordValidator), resetPassWord);

export default router;
