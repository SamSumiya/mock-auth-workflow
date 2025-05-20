import fs from 'fs/promises'  
import { SESSION_FILE } from '../utils/fakeSessionStore'
// import { Session } from "../types/session"
import { fakeSessionStore } from '../utils/fakeSessionStore'
import { createId } from "../utils/helpers"
import { User } from "../types/user"
import { fakeUsers } from '../data/fakeUserStore'

export async function fakeFetchSession(email: string): Promise<string|null> {
    return new Promise<string|null>((resolve, reject) => {
        setTimeout(() => {
            const existingSession = Object.entries(fakeSessionStore).find(
                    ([__, session]) => session.email === email) 
                    if (existingSession) {
                        return resolve(existingSession[0])
                    } else {
                        return resolve(null)
                    }
        }, 150)
    })
}

export async function createFakeSession(email: string):Promise<string|null> {
    const sessionId = createId()

    fakeSessionStore[sessionId] = {
        id: createId(),
        email: email, 
        createdAt: Date.now()
    }
    
    try {
        await fs.writeFile(SESSION_FILE, JSON.stringify(fakeSessionStore, null, 2));
        return sessionId
    } catch (err) {
        console.error("❌ Failed to persist session store:", err);
        return null;
    }
}