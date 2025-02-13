import {Router} from "express"
import { loginController, logOutController, registerController,getUserController } from "../controllers/auth.controller";
import userMiddleware from "../middlewares/user.middleware";

const router = Router()

router.post("/signup",registerController);
router.post("/login",loginController);
router.post("/logout",userMiddleware,logOutController);
router.get('/',userMiddleware,getUserController)

export default router