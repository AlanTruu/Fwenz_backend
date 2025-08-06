"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = exports.setAuthCookies = exports.getRefreshTokenCookieOptions = exports.getAccessTokenCookieOptions = exports.REFRESH_PATH = void 0;
const Date_1 = require("./Date");
const secure = true;
exports.REFRESH_PATH = '/auth/refresh';
const defaults = {
    sameSite: secure ? 'none' : 'lax',
    httpOnly: true,
    secure: secure
};
const getAccessTokenCookieOptions = () => ({
    ...defaults,
    expires: (0, Date_1.fifteenMinuteFromNow)()
});
exports.getAccessTokenCookieOptions = getAccessTokenCookieOptions;
const getRefreshTokenCookieOptions = () => ({
    ...defaults,
    expires: (0, Date_1.thirtyDaysFromNow)(),
    path: exports.REFRESH_PATH
});
exports.getRefreshTokenCookieOptions = getRefreshTokenCookieOptions;
const setAuthCookies = ({ res, accessToken, refreshToken }) => res.cookie('accessToken', accessToken, (0, exports.getAccessTokenCookieOptions)()).cookie('refreshToken', refreshToken, (0, exports.getRefreshTokenCookieOptions)());
exports.setAuthCookies = setAuthCookies;
const clearAuthCookies = (res) => res.clearCookie('accessToken').clearCookie('refreshToken', { path: exports.REFRESH_PATH });
exports.clearAuthCookies = clearAuthCookies;
