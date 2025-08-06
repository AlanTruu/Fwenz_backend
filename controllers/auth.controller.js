"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordHandler = exports.sendPasswordResetHandler = exports.verifyEmailHandler = exports.refreshHandler = exports.logoutHandler = exports.loginHandler = exports.registerHandler = void 0;
const auth_service_1 = require("../services/auth.service");
const cookies_1 = require("../utils/cookies");
const auth_schemas_1 = require("./auth.schemas");
const auth_service_2 = require("../services/auth.service");
const jwt_1 = require("../utils/jwt");
const session_model_1 = __importDefault(require("../models/session.model"));
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const http_1 = require("../constants/http");
const registerHandler = async (req, res, next) => {
    //validate request
    const request = auth_schemas_1.registerSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent']
    });
    //service
    const { user, refreshToken, accessToken } = await (0, auth_service_1.createAccount)(request);
    //return
    return void (0, cookies_1.setAuthCookies)({ res, accessToken, refreshToken }).status(201).json(user);
};
exports.registerHandler = registerHandler;
const loginHandler = async (req, res) => {
    const request = auth_schemas_1.loginSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent']
    });
    const { user, refreshToken, accessToken } = await (0, auth_service_2.loginUser)(request);
    return void (0, cookies_1.setAuthCookies)({ res, accessToken, refreshToken }).status(201).json({ message: 'login successful' });
};
exports.loginHandler = loginHandler;
const logoutHandler = async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const { payload } = (0, jwt_1.verifyToken)(accessToken || "");
    if (payload) {
        await session_model_1.default.findByIdAndDelete(payload.sessionID);
    }
    return void (0, cookies_1.clearAuthCookies)(res).status(201).json({ message: 'logout successful' });
};
exports.logoutHandler = logoutHandler;
const refreshHandler = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    (0, appAssert_1.default)(refreshToken, http_1.UNAUTHORIZED, "Missing refresh token");
    const { accessToken, newRefreshToken } = await (0, auth_service_1.refreshUserAccessToken)(refreshToken);
    if (newRefreshToken) {
        res.cookie('refreshToken', newRefreshToken, (0, cookies_1.getRefreshTokenCookieOptions)());
    }
    return void res.status(http_1.OK).cookie('accessToken', accessToken, (0, cookies_1.getAccessTokenCookieOptions)()).json({
        message: 'Access token refreshed'
    });
};
exports.refreshHandler = refreshHandler;
const verifyEmailHandler = async (req, res) => {
    const verificationCode = auth_schemas_1.verificationCodeSchema.parse(req.params.code);
    await (0, auth_service_1.verifyEmail)(verificationCode);
    return void res.status(http_1.OK).json({
        message: 'Email was successfully verified'
    });
};
exports.verifyEmailHandler = verifyEmailHandler;
const sendPasswordResetHandler = async (req, res) => {
    const email = auth_schemas_1.emailSchema.parse(req.body.email);
    await (0, auth_service_1.sendPasswordResetEmail)(email);
    return void res.status(http_1.OK).json({ message: 'Password reset email sent' });
};
exports.sendPasswordResetHandler = sendPasswordResetHandler;
const resetPasswordHandler = async (req, res) => {
    const request = auth_schemas_1.resetPasswordSchema.parse(req.body);
    await (0, auth_service_1.resetPassword)(request);
    return void (0, cookies_1.clearAuthCookies)(res).status(http_1.OK).json({ message: 'Password reset successful' });
};
exports.resetPasswordHandler = resetPasswordHandler;
