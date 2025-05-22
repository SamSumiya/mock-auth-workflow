import { PreRegisterUser, User } from "../types/user";
import { fakeRegister } from "../auth/register";
import { getOrCreateSession } from "../auth/session";

const user = {
    firstname: 'Sam',
    lastname: 'Sumiya',
    email: 'sam_sumiya@sample.com',
    password: 'password123' 
} as PreRegisterUser

async function fakeClientRegister(user: PreRegisterUser) {
    try { 
        const registeredUser = await fakeRegister(user) 
        if ( typeof registeredUser === 'object' && 
            registeredUser && 
            'email' in registeredUser
        ) {
            console.log(registeredUser)
            const sessionId = await getOrCreateSession(registeredUser.userId)
        }
    } catch(err) {
        const error = err instanceof Error ? err : new Error('Failed to register new user')
        console.error(error)
        process.exit(1)
    }
}

fakeClientRegister(user)
