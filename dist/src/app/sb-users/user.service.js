"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const supabase_config_1 = require("@/config/supabase.config");
class UserService {
    async createUser(payload) {
        const { data, error: authError } = await supabase_config_1.supabase.auth.admin.createUser({
            email: payload.email,
            password: payload.password,
            user_metadata: {
                ...payload
            },
            email_confirm: true
        });
        if (authError)
            throw `[AuthErrorService]: ${authError}`;
        const { data: user, error: userError } = await supabase_config_1.supabase
            .from("sb_users")
            .insert({
            ...data.user.user_metadata,
            user_uid: data.user.id
        })
            .select()
            .single();
        if (userError)
            throw `[UserErrorService]: ${JSON.stringify(userError, null, 0)}`;
        return user;
    }
}
exports.UserService = UserService;
exports.default = UserService;
//# sourceMappingURL=user.service.js.map