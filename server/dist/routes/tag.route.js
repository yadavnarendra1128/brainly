"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_middleware_1 = __importDefault(require("../middlewares/user.middleware"));
const tag_controller_1 = require("../controllers/tag.controller");
const router = (0, express_1.Router)();
router.get('/', user_middleware_1.default, tag_controller_1.getTagsController);
router.post("/", user_middleware_1.default, tag_controller_1.addTagController);
router.delete("/:id", user_middleware_1.default, tag_controller_1.removeTagController);
exports.default = router;
