import { Cookie } from "../types/cookie"

export const cookieStore: Record<string, Record<string, Cookie>> = {} 

export function setCookie(sessionId: string, name: string, value: string, expiresInMS?: number ) {
    const expiresAt = expiresInMS ? Date.now() + expiresInMS : null; 
    if (!cookieStore[sessionId]) {
        cookieStore[sessionId] = {} 
    }

    const cookieData = cookieStore[sessionId][name] = {
        value,
        expiresAt
    }

}

