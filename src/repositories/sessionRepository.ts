import fs from 'fs/promises' 
import { Session } from "../types/session"
import { fakeSessionStore } from '../store/mockSessionStore'
import { createId } from "../utils/helpers"
import { sessionFilePath } from '../store/mockSessionStore'
import { readFromFile } from '../utils/readFromFile'
import path from 'path'
type SessionRecord = Record<string, Session>

export async function fakeFetchSession(userId: string): Promise<string|null> {
    const sessionFilePath = path.join(__dirname, '../fixtures/sessions.json')
    const sessionFile = await readFromFile<SessionRecord>(sessionFilePath)

    return new Promise<string|null>((resolve) => {
        setTimeout(() => {
            const existingSession = Object.entries(sessionFile).find(
                    ([_,session]) => {
                        session.userId === userId}
                    ) 
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
        sessionId, 
        createdAt: Date.now(),
        maxAge: 1000 * 60, 
    }
    
    try {
        await fs.writeFile(sessionFilePath, JSON.stringify(fakeSessionStore, null, 2));
        return sessionId
    } catch (err) {
        console.error("❌ Failed to persist session store:", err);
        return null;
    }
}