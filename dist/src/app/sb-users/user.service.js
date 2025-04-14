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
    async updateUser(payload) {
        console.log(payload);
        const { data, error: authError } = await supabase_config_1.supabase.auth.admin.updateUserById(payload.user_uid, {
            email: payload.email,
            password: payload.password,
            user_metadata: {
                ...payload
            },
        });
        if (authError)
            throw `[AuthErrorService]: ${authError}`;
        const { data: user, error: userError } = await supabase_config_1.supabase
            .from("sb_users")
            .update({
            ...data.user.user_metadata,
            user_uid: data.user.id
        })
            .eq("user_id", payload.user_id)
            .single();
        if (userError)
            throw `[UserErrorService]: ${JSON.stringify(userError, null, 0)}`;
        return user;
    }
    async updateUserStatus(payload, status) {
        const { data: userData, error: fetchError } = await supabase_config_1.supabase
            .from("sb_users")
            .select("*")
            .eq("user_id", payload.user_id)
            .single();
        if (fetchError)
            throw `[FetchErrorService]: ${fetchError}`;
        const { error: updateError } = await supabase_config_1.supabase
            .from("sb_users")
            .update({ status })
            .eq("user_id", payload.user_id);
        if (updateError)
            throw `[UpdateErrorService]: ${updateError}`;
        if (userData.user_uid) {
            const { error: authError } = await supabase_config_1.supabase.auth.admin.updateUserById(userData.user_uid, {
                user_metadata: {
                    ...userData,
                    status
                }
            });
            if (authError)
                throw `[AuthErrorService]: ${authError}`;
        }
        return true;
    }
    async archiveUser(payload) {
        return this.updateUserStatus(payload, 'archived');
    }
    async unarchiveUser(payload) {
        return this.updateUserStatus(payload, 'active');
    }
}
exports.UserService = UserService;
exports.default = UserService;
//# sourceMappingURL=user.service.js.map