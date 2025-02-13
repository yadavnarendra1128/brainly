"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const content_controller_1 = require("../controllers/content.controller");
const user_middleware_1 = __importDefault(require("../middlewares/user.middleware"));
const router = (0, express_1.Router)();
// --------------------------------------------------------------------------------------------------------------
// content create
router.post("/", user_middleware_1.default, content_controller_1.createContentController);
// --------------------------------------------------------------------------------------------------------------
//  get content
// get all content
router.get("/", user_middleware_1.default, content_controller_1.getAllContentController);
// get content by id
router.get("/:id", user_middleware_1.default, content_controller_1.getContentByIdController);
// get content based on type
router.get("/type/:type", user_middleware_1.default, content_controller_1.getTypeContentController);
// get content based on tag
router.get("/tag/:tag", user_middleware_1.default, content_controller_1.getTagContentController);
router.get("/type/:type/tag/:tag", user_middleware_1.default, content_controller_1.getTagType);
// --------------------------------------------------------------------------------------------------------------
//  content update 
// update content
router.put("/:id", user_middleware_1.default, content_controller_1.updateContentController);
// update tags in content
router.put("/tags/:id", user_middleware_1.default, content_controller_1.updateTagsController);
// --------------------------------------------------------------------------------------------------------------
// delete content
router.delete("/:id", user_middleware_1.default, content_controller_1.deleteContentController);
// --------------------------------------------------------------------------------------------------------------
// share link
// Share Content Link
router.get("/share/content/:id", user_middleware_1.default, content_controller_1.shareContentController);
// Share Brain Link
router.get("/share/brain", user_middleware_1.default, content_controller_1.shareBrainController);
// --------------------------------------------------------------------------------------------------------------
// access shared link content
// Access Shared Content
router.get("/shared/content/:link/:id", content_controller_1.getContentByIdController);
router.get("/shared/:id", content_controller_1.getContentByIdController);
// Access Shared Brain
router.get("/shared/brain/:link/:id", content_controller_1.getBrainController);
exports.default = router;
