"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneHourFromNow = exports.fiveMinutesAgo = exports.ONE_DAY_MS = exports.fifteenMinuteFromNow = exports.thirtyDaysFromNow = exports.oneYearFromNow = void 0;
const oneYearFromNow = () => {
    return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
};
exports.oneYearFromNow = oneYearFromNow;
const thirtyDaysFromNow = () => {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
};
exports.thirtyDaysFromNow = thirtyDaysFromNow;
const fifteenMinuteFromNow = () => new Date(Date.now() + 15 * 60 * 60 * 1000);
exports.fifteenMinuteFromNow = fifteenMinuteFromNow;
exports.ONE_DAY_MS = 24 * 60 * 60 * 1000;
const fiveMinutesAgo = () => new Date(Date.now() - 5 * 60 * 1000);
exports.fiveMinutesAgo = fiveMinutesAgo;
const oneHourFromNow = () => new Date(Date.now() + 60 * 60 * 1000);
exports.oneHourFromNow = oneHourFromNow;
