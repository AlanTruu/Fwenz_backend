"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("../constants/env");
exports.supabase = (0, supabase_js_1.createClient)(env_1.SUPABASE_URL, env_1.SUPABASE_KEY);
