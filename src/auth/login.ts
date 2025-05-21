import { fakeFetchSession } from "../repositories/sessionRepository";
import { fakeFetchUserByEmail } from "../repositories/userRepository";
import { getOrCreateSession } from "./session";

export async function fakeLogin() { 
    try {
        const user = await fakeFetchUserByEmail('g_turner@example.com')
        const sessionId = await getOrCreateSession(user.email)
        console.log(sessionId, 'sessssionId')
    } catch( err ) {
        const e = err as Error
        console.log(`${e}`)
    }
}
