import { createId } from '../utils/helpers';

import { fakeSessionStore } from '../utils/fakeSessionStore';

import { createFakeSession, fakeFetchSession } from '../repositories/sessionRepository';
import { User } from '../types/user';

// Fake Login a user
export async function getOrCreateSession( email: string ): Promise<string|null> {

    try {
       const sessionId = await fakeFetchSession(email)
       console.log(sessionId, 'sessionId from getOrCreateSession')
       if ( sessionId ) {
            return sessionId
       } else {
            console.log('createFakeSession(email)')
            return createFakeSession(email)
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




