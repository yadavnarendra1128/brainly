import { Router } from "express";
import {
  updateContentController,
  createContentController,
  getAllContentController,
  deleteContentController,
  shareContentController,
  getTypeContentController,
  shareBrainController,
  getBrainController,
  updateTagsController,
  getTagContentController,
  getContentByIdController,
  getTagType,
} from "../controllers/content.controller";
import userMiddleware from "../middlewares/user.middleware";

const router = Router();

// --------------------------------------------------------------------------------------------------------------
// content create
router.post("/", userMiddleware, createContentController);

// --------------------------------------------------------------------------------------------------------------
//  get content

// get all content
router.get("/", userMiddleware, getAllContentController);

// get content by id
router.get("/:id", userMiddleware, getContentByIdController);

// get content based on type
router.get("/type/:type", userMiddleware, getTypeContentController);

// get content based on tag
router.get("/tag/:tag", userMiddleware, getTagContentController);


router.get("/type/:type/tag/:tag",userMiddleware,getTagType)
// --------------------------------------------------------------------------------------------------------------
//  content update 

// update content
router.put("/:id", userMiddleware, updateContentController);

// update tags in content
router.put("/tags/:id", userMiddleware, updateTagsController);


// --------------------------------------------------------------------------------------------------------------
// delete content
router.delete("/:id", userMiddleware, deleteContentController);

// --------------------------------------------------------------------------------------------------------------
// share link

// Share Content Link
router.get("/share/content/:id", userMiddleware, shareContentController);

// Share Brain Link
router.get("/share/brain", userMiddleware, shareBrainController);

// --------------------------------------------------------------------------------------------------------------
// access shared link content

// Access Shared Content
router.get("/shared/content/:link/:id", getContentByIdController);
router.get("/shared/:id", getContentByIdController);

// Access Shared Brain
router.get("/shared/brain/:link/:id", getBrainController);

export default router;