"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../constants//env");
const connectToDB = async () => {
    try {
        await mongoose_1.default.connect(env_1.MONGO_URI);
        console.log('DB connected');
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
exports.default = connectToDB;
