import { supabase } from "@/config/supabase.config";
import { IUser } from "./user.interface";


export class UserService {

  async createUser(payload: IUser): Promise<IUser>  {

    const { data, error: authError } = await supabase.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      user_metadata: {
        ...payload
      },
      email_confirm: true
    })


    if(authError) throw  `[AuthErrorService]: ${authError}`;

    const { data: user, error: userError } = await supabase
    .from("sb_users")
    .insert({
      ...data.user.user_metadata,
      user_uid: data.user.id
    })
    .select()
    .single();

    if(userError) throw  `[UserErrorService]: ${JSON.stringify(userError, null, 0)}`;

    return user;
  }

  async updateUser(payload: IUser): Promise<IUser>  {
    console.log(payload)
    const { data, error: authError } = await supabase.auth.admin.updateUserById(payload.user_uid as string, {
      email: payload.email,
      password: payload.password,
      user_metadata: {
        ...payload
      },
    })


    if(authError) throw  `[AuthErrorService]: ${authError}`;

    const { data: user, error: userError } = await supabase
    .from("sb_users")
    .update({
      ...data.user.user_metadata,
      user_uid: data.user.id
    })
    .eq("user_id", payload.user_id)
    .single();

    if(userError) throw  `[UserErrorService]: ${JSON.stringify(userError, null, 0)}`;

    return user;
  }

  async updateUserStatus(payload: Partial<IUser>, status: 'active' | 'archived' | 'suspended'): Promise<boolean> {
    // First get the user to get both user_id and user_uid
    const { data: userData, error: fetchError } = await supabase
      .from("sb_users")
      .select("*")
      .eq("user_id", payload.user_id)
      .single();

    if(fetchError) throw `[FetchErrorService]: ${fetchError}`;

    // Update the user's status in the sb_users table
    const { error: updateError } = await supabase
      .from("sb_users")
      .update({ status })
      .eq("user_id", payload.user_id);

    if(updateError) throw `[UpdateErrorService]: ${updateError}`;

    // Update the user's status in the auth table if needed
    if (userData.user_uid) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userData.user_uid,
        { 
          user_metadata: { 
            ...userData,
            status
          } 
        }
      );

      if(authError) throw `[AuthErrorService]: ${authError}`;
    }

    return true;
  }
  
  async archiveUser(payload: Partial<IUser>): Promise<boolean> {
    return this.updateUserStatus(payload, 'archived');
  }
  
  async unarchiveUser(payload: Partial<IUser>): Promise<boolean> {
    return this.updateUserStatus(payload, 'active');
  }

}

export default UserService;

