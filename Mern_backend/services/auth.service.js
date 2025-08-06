"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.sendPasswordResetEmail = exports.verifyEmail = exports.refreshUserAccessToken = exports.loginUser = exports.createAccount = void 0;
const user_model_1 = require("../models/user.model");
const verificationCode_model_1 = __importDefault(require("../models/verificationCode.model"));
const Date_1 = require("../utils/Date");
const session_model_1 = __importDefault(require("../models/session.model"));
const env_1 = require("../constants/env");
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const http_1 = require("../constants/http");
const jwt_1 = require("../utils/jwt");
const sendMail_1 = require("../utils/sendMail");
const emailTemplates_1 = require("../utils/emailTemplates");
const bcrypt_1 = require("../utils/bcrypt");
exports.createAccount = (async (data) => {
    //verify existing user doesn't exist
    const existingUser = await user_model_1.UserModel.exists({
        email: data.email,
    });
    (0, appAssert_1.default)(!existingUser, http_1.CONFLICT, 'Email already in use');
    //create user ifne
    const user = await user_model_1.UserModel.create({
        email: data.email,
        password: data.password
    });
    const uid = user._id;
    //create verification code
    const verificationCode = await verificationCode_model_1.default.create({
        userID: uid,
        type: "email_verification" /* VerificationCodeType.EmailVerification */,
        expiresAt: (0, Date_1.oneYearFromNow)()
    });
    const url = `${env_1.APP_ORIGIN}/auth/email/verify/${verificationCode._id}`;
    const { error } = await (0, sendMail_1.sendMail)({
        to: user.email,
        ...(0, emailTemplates_1.getVerifyEmailTemplate)(url)
    });
    if (error) {
        console.error(error);
    }
    //create session
    const session = await session_model_1.default.create({
        userID: uid,
        userAgent: data.userAgent
    });
    //sign access/refresh token
    const refreshToken = (0, jwt_1.signToken)({ sessionID: session._id }, jwt_1.refreshTokenSignOptions);
    const accessToken = (0, jwt_1.signToken)({ userID: uid, sessionID: session._id });
    //return user and tokens
    return { user: user.omitPassword(), refreshToken, accessToken };
});
const loginUser = async ({ email, password, userAgent }) => {
    // get the user by email
    //validate password
    //create session
    //sign access and refresh tokens
    const user = await user_model_1.UserModel.findOne({ email });
    (0, appAssert_1.default)(user, http_1.UNAUTHORIZED, 'Invalid email or password');
    const isValid = await user.comparePassword(password);
    (0, appAssert_1.default)(isValid, http_1.UNAUTHORIZED, 'Invalid email or password');
    const userID = user._id;
    const session = await session_model_1.default.create({
        userID,
        userAgent
    });
    const sessionInfo = {
        sessionID: session._id,
    };
    const refreshToken = (0, jwt_1.signToken)(sessionInfo, jwt_1.refreshTokenSignOptions);
    const accessToken = (0, jwt_1.signToken)({ ...sessionInfo, userID });
    return { user: user.omitPassword(), refreshToken, accessToken };
};
exports.loginUser = loginUser;
const refreshUserAccessToken = async (refreshToken) => {
    //Verify refreshToken
    const { payload } = (0, jwt_1.verifyToken)(refreshToken, { secret: jwt_1.refreshTokenSignOptions.secret });
    (0, appAssert_1.default)(payload, http_1.UNAUTHORIZED, "Invalid refresh token");
    //find session by payload sessionID, check to make sure that it exists and hasn't expired
    const session = await session_model_1.default.findById(payload.sessionID);
    const now = Date.now();
    (0, appAssert_1.default)(session && session?.expiresAt.getTime() > now, http_1.UNAUTHORIZED, "Session expired");
    //refresh the session if expires in next 24h 
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= Date_1.ONE_DAY_MS;
    if (sessionNeedsRefresh) {
        session.expiresAt = (0, Date_1.thirtyDaysFromNow)();
        await session.save();
    }
    //make new tokens
    const newRefreshToken = sessionNeedsRefresh ? (0, jwt_1.signToken)({ sessionID: session._id }, jwt_1.refreshTokenSignOptions) : undefined;
    const accessToken = (0, jwt_1.signToken)({ userID: session.userID, sessionID: session._id, });
    return { accessToken, newRefreshToken };
};
exports.refreshUserAccessToken = refreshUserAccessToken;
const verifyEmail = async (code) => {
    //get verification code
    const validCode = await verificationCode_model_1.default.findOne({
        _id: code,
        type: "email_verification" /* VerificationCodeType.EmailVerification */,
        expiresAt: { $gt: new Date() }
    });
    (0, appAssert_1.default)(validCode, http_1.NOT_FOUND, 'Invalid or expired verification code');
    //find and update user 
    const updatedUser = await user_model_1.UserModel.findByIdAndUpdate(validCode.userID, {
        verified: true
    }, { new: true });
    (0, appAssert_1.default)(updatedUser, http_1.INTERNAL_SERVER_ERROR, 'Failed to verify email');
    await validCode.deleteOne();
    return { user: updatedUser.omitPassword() };
};
exports.verifyEmail = verifyEmail;
const sendPasswordResetEmail = async (email) => {
    //get user by email
    try {
        const user = await user_model_1.UserModel.findOne({ email });
        (0, appAssert_1.default)(user, http_1.NOT_FOUND, 'User not found');
        //check email rate limit
        const fiveMinAgo = (0, Date_1.fiveMinutesAgo)();
        const count = await verificationCode_model_1.default.countDocuments({
            userID: user._id,
            type: "password_reset" /* VerificationCodeType.PasswordReset */,
            createdAt: { $gt: fiveMinAgo }
        });
        (0, appAssert_1.default)(count <= 1, http_1.TOO_MANY_REQUESTS, 'Too many requests, please try again later');
        //create verification code
        const expiresAt = (0, Date_1.oneHourFromNow)();
        const verificationCode = await verificationCode_model_1.default.create({
            userID: user._id,
            type: "password_reset" /* VerificationCodeType.PasswordReset */,
            expiresAt
        });
        //send verification email
        const url = `${env_1.APP_ORIGIN}/password/reset/?code=${verificationCode._id}&exp=${expiresAt.getTime()}`;
        const { data, error } = await (0, sendMail_1.sendMail)({
            to: user.email,
            ...(0, emailTemplates_1.getPasswordResetTemplate)(url)
        });
        (0, appAssert_1.default)(data?.id, http_1.INTERNAL_SERVER_ERROR, `${error?.name} - ${error?.message}`);
        //return success
        return { url, emailID: data.id };
    }
    catch (err) {
        console.log('SendPasswordResetError', err.message);
        return {};
    }
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const resetPassword = async ({ password, verificationCode }) => {
    //get verification code
    //update password if valid
    //delete verification code
    //delete all sessions
    const code = await verificationCode_model_1.default.findOne({
        _id: verificationCode,
        type: "password_reset" /* VerificationCodeType.PasswordReset */,
        expiresAt: { $gt: new Date() }
    });
    (0, appAssert_1.default)(code, http_1.NOT_FOUND, 'Invalid verification code');
    const updatedUser = await user_model_1.UserModel.findByIdAndUpdate(code.userID, { password: await (0, bcrypt_1.hashValue)(password) });
    (0, appAssert_1.default)(updatedUser, http_1.INTERNAL_SERVER_ERROR, 'Failed to reset password');
    await code.deleteOne();
    await session_model_1.default.deleteMany({ userID: updatedUser._id });
    return { user: updatedUser.omitPassword() };
};
exports.resetPassword = resetPassword;
