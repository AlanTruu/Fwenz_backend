"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = require("../controllers/post.controller");
const postRoutes = (0, express_1.Router)();
postRoutes.get('/:person_name', post_controller_1.postHandler);
exports.default = postRoutes;
