import fs from 'fs/promises'  
// import { SESSION_FILE } from '../utils/fakeSessionStore'
// import { Session } from "../types/session"
import { fakeSessionStore } from '../utils/fakeSessionStore'
import { createId } from "../utils/helpers"
import { User } from "../types/user"
import { fakeUsers } from '../data/fakeUserStore'
import { sessionFilePath } from '../utils/fakeSessionStore'

export async function fakeFetchSession(userId: string): Promise<string|null> {
    return new Promise<string|null>((resolve) => {
        setTimeout(() => {
            const existingSession = Object.entries(fakeSessionStore).find(
                    ([id, _]) => userId === id) 
                    if (existingSession) {
                        return resolve(existingSession[0])
                    } else {
                        return resolve(null)
                    }
        }, 150)
    })
}

export async function createFakeSession(userId: string):Promise<string|null> {
    const sessionId = createId()

    fakeSessionStore[sessionId] = {
        userId,
        createdAt: Date.now()
    }
    
    try {
        await fs.writeFile(sessionFilePath, JSON.stringify(fakeSessionStore, null, 2));
        return sessionId
    } catch (err) {
        console.error("❌ Failed to persist session store:", err);
        return null;
    }
}