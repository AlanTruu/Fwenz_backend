"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../utils/AppError"));
const cookies_1 = require("../utils/cookies");
const handleZodError = (res, error) => {
    const errors = error.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message
    }));
    return void res.status(400).json({
        message: error.message,
        errors
    });
};
const handleAppError = (res, error) => {
    return void res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode
    });
};
const errorHandler = (error, req, res, next) => {
    console.log(`PATH: ${req.path}`, error);
    if (req.path === cookies_1.REFRESH_PATH) {
        (0, cookies_1.clearAuthCookies)(res);
    }
    if (error instanceof zod_1.z.ZodError) {
        return handleZodError(res, error);
    }
    if (error instanceof AppError_1.default) {
        return handleAppError(res, error);
    }
    return void res.status(500).send('Internal server error');
};
exports.default = errorHandler;
