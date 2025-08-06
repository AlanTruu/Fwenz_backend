"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postHandler = void 0;
const supa_1 = require("../utils/supa");
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const http_1 = require("../constants/http");
const postHandler = async (req, res) => {
    const person_name = req.params.person_name;
    //use the name to pull data from DB
    //get all data and return as object
    //maybe return an array of objects to make it easier?
    const { data, error } = await supa_1.supabase.from('posts').select('*').eq('person_name', person_name);
    (0, appAssert_1.default)(data, http_1.BAD_REQUEST, 'Could not find posts');
    (0, appAssert_1.default)(data.length > 0, http_1.BAD_REQUEST, 'Could not find posts');
    return void res.status(http_1.OK).json(data);
};
exports.postHandler = postHandler;
