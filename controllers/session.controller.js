"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllSessionsHandler = exports.deleteSessionHandler = exports.getSessionsHandler = void 0;
const session_model_1 = __importDefault(require("../models/session.model"));
const http_1 = require("../constants/http");
const zod_1 = require("zod");
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const getSessionsHandler = async (req, res) => {
    const sessions = await session_model_1.default.find({
        userID: req.userID,
        expiresAt: { $gt: new Date() }
    }, { _id: 1, userAgent: 1, createdAt: 1 }, { sort: { createdAt: -1 } });
    return void res.status(http_1.OK).json(sessions.map((session) => ({
        ...session.toObject(),
        ...(session.id === req.sessionID && { isCurrent: true })
    })));
};
exports.getSessionsHandler = getSessionsHandler;
const deleteSessionHandler = async (req, res) => {
    const sessionID = zod_1.z.string().parse(req.params.id);
    const deleted = await session_model_1.default.findOneAndDelete({
        _id: sessionID,
        userID: req.userID
    });
    (0, appAssert_1.default)(deleted, http_1.NOT_FOUND, 'Session not found');
    return void res.status(http_1.OK).json({ message: 'Session deleted' });
};
exports.deleteSessionHandler = deleteSessionHandler;
const deleteAllSessionsHandler = async (req, res) => {
    await session_model_1.default.deleteMany({ userID: req.userID });
    return void res.status(http_1.OK).json({ message: 'All Sessions deleted' });
};
exports.deleteAllSessionsHandler = deleteAllSessionsHandler;
