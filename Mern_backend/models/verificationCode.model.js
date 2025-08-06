"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const VerificationCodeSchema = new mongoose_1.default.Schema({
    userID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    type: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, required: true }
});
const VerificationCodeModel = mongoose_1.default.model('VerificationCode', VerificationCodeSchema, 'verification_codes');
exports.default = VerificationCodeModel;
