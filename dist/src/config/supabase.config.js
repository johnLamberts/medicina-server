"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const load_envs_config_1 = require("./load-envs.config");
exports.supabase = (0, supabase_js_1.createClient)(load_envs_config_1.environmentConfig.SUPABASE_URL, load_envs_config_1.environmentConfig.SUPABASE_API_KEYS);
//# sourceMappingURL=supabase.config.js.map