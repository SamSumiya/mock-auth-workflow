import { PublicUser, PreRegisterUser } from "../types/user";

// type AddUserResult = { id: string } | { id: 'user_already_exists' };
import { addUser } from "../services/userStore";
import { AddUserResult } from "../types/addUserResult";

export async function fakeRegister(user: PreRegisterUser): Promise<PublicUser | AddUserResult | null> {
    try {
        const registerUser = await addUser(user)
        return registerUser as PublicUser
    } catch(err)  {
        console.log(err)
        return null 
    }
};