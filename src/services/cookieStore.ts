import { Cookie } from "../types/cookie"
import { persistCookie } from "../repositories/cookieRepository";

export const cookieStore: Record<string, Record<string, Cookie>> = {} 



export function createCookie (value: string, expiresInMS?: number) {
    const expiresAt = expiresInMS ? Date.now() + expiresInMS : null 

    return { value, expiresAt } 
}

export async function setCookie(sessionId: string, name: string, value: string, expiresInMS?: number ): Promise<void> {
    if (!cookieStore[sessionId]) {
        cookieStore[sessionId] = {} 
    }

    const cookieData = createCookie(value, expiresInMS)

    cookieStore[sessionId][name] = cookieData;

    return await persistCookie(name, sessionId, cookieData)
}

