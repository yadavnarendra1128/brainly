import { Router } from "express";
import userMiddleware from "../middlewares/user.middleware";
import { addTagController, getTagsController, removeTagController } from "../controllers/tag.controller";


const router = Router();

router.get('/',userMiddleware,getTagsController)
router.post("/", userMiddleware, addTagController);
router.delete("/:id", userMiddleware, removeTagController);

export default router;