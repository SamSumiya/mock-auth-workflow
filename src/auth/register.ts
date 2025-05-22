import { User, PublicUser, PreRegisterUser } from "../types/user";


// type AddUserResult = { id: string } | { id: 'user_already_exists' };
import { addUser } from "../data/userStore";
import { AddUserResult } from "../types/AddUserResult";

export async function fakeRegister(): Promise<PublicUser | AddUserResult | null> {
    const user = {
        firstname: 'Sam',
        lastname: 'Sumiya',
        email: 'sam_sumiya@sample.com',
        password: 'password123' 
    } as PreRegisterUser

    try {
        const registerUser = await addUser(user)
        return registerUser as PublicUser
    } catch(err)  {
        console.log(err)
        return null 
    }
}

fakeRegister()