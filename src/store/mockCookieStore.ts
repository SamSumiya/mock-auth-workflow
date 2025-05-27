import { Cookie } from "../types/cookie"
import { persistCookie } from "../repositories/cookieRepository";

export const cookieStore: Record<string, Record<string, Cookie>> = {} 

export async function setCookie(sessionId: string, name: string, value: string, expiresInMS?: number ): Promise<void> {
    const expiresAt = expiresInMS ? Date.now() + expiresInMS : null; 

    if (!cookieStore[sessionId]) {
        cookieStore[sessionId] = {} 
    }

    const cookieData: Cookie =  { value, expiresAt } 
    cookieStore[sessionId][name] = cookieData;

    return await persistCookie(name, sessionId, cookieData)
}

