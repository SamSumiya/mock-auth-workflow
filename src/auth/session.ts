import { createFakeSession, fakeFetchSession } from '../repositories/sessionRepository';


// Fake Login a user
export async function getOrCreateSession( userId: string ): Promise<string|null> {

    try {
        const sessionId = await fakeFetchSession(userId)
        console.log(sessionId, 'SessionSessionSession')
        if ( sessionId ) {
            return sessionId
        } else {
            const sessuonId =  await createFakeSession(userId)
            return sessuonId
        }
    } catch(err) {
        const error = err as Error
        console.error(error)
        return null;
    }
}

// login('sam_sumiya@example.com')
//     .then((sessionId) => {
//         console.log('Logged in. Session ID:', sessionId)
//         process.exit(0)
//     })
//     .catch((err) =>  {
//         const error = err as Error;
//         console.error(error)
//         process.exit(1)
//     })




