"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const env_1 = require("./constants/env");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const authenticate_1 = __importDefault(require("./middleware/authenticate"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const session_route_1 = __importDefault(require("./routes/session.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: env_1.APP_ORIGIN,
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.get('/', async (req, res, next) => {
    throw new Error('meeep');
    res.status(200).json({ status: 'healthy' });
});
app.use('/auth', auth_route_1.default);
//protected routes
app.use('/user', authenticate_1.default, user_route_1.default);
app.use('/sessions', authenticate_1.default, session_route_1.default);
app.use('/posts', authenticate_1.default, post_route_1.default);
app.use(errorHandler_1.default);
app.listen(env_1.PORT, async () => {
    await (0, db_1.default)();
    console.log(`Listening on ${process.env.PORT}`);
});
