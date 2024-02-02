import { Router } from "express";
import { createUser, updateUserLocation } from "../controller/userController";


const router:Router = Router();

router.route('/create-user').post(createUser);
router.route('/create-user-location').post(updateUserLocation);

export default router;