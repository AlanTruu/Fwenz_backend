"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserHandler = void 0;
const user_model_1 = require("../models/user.model");
const http_1 = require("../constants/http");
const http_2 = require("../constants/http");
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const getUserHandler = async (req, res) => {
    const user = await user_model_1.UserModel.findById(req.userID);
    (0, appAssert_1.default)(user, http_1.NOT_FOUND, 'User not found');
    return void res.status(http_2.OK).json(user.omitPassword());
};
exports.getUserHandler = getUserHandler;
