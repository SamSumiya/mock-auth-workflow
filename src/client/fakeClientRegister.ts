import { PreRegisterUser, User } from "../types/user";
import { fakeRegister } from "../auth/register";
import { getOrCreateSession } from "../auth/session";
import { setCookie } from "../store/mockCookieStore";

const user = {
    firstname: 'Sam',
    lastname: 'Sumiya',
    email: 'sam_sumiya@sample.com',
    password: 'password123' 
} as PreRegisterUser

async function fakeClientRegister(user: PreRegisterUser) {
    try { 
        const registeredUser = await fakeRegister(user) 
        
        if ( registeredUser && 'message' in registeredUser) {
            return registeredUser.message
        }

        if (!registeredUser?.email) return; 

        const sessionId = await getOrCreateSession(registeredUser.userId)
        if ( sessionId ) {
            await setCookie(sessionId, 'sid', sessionId, 1000 * 60)
        }
    } catch(err) {
        const error = err instanceof Error ? err : new Error('Failed to register new user')
        console.error(error)
    }
}

fakeClientRegister(user)
    .then((result) => {
        if (result) console.log(result)
        process.exit(0)
    })
    .catch(err => {
        console.error(err)
        process.exit(1)
    })
