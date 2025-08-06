"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const resend_1 = __importDefault(require("../config/resend"));
const getFromEmail = () => 
// NODE_ENV === 'development' ? 'onboarding@resend.dev' : EMAIL_SENDER;
'onboarding@resend.dev';
const getToEmail = (to) => 
// NODE_ENV === 'development' ? 'delivered@resend.dev' : to;
to;
const sendMail = async ({ to, subject, text, html }) => {
    return await resend_1.default.emails.send({
        from: getFromEmail(),
        to: getToEmail(to),
        subject,
        text,
        html
    });
};
exports.sendMail = sendMail;
