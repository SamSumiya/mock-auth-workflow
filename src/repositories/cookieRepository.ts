import { writeToFile } from "../utils/writeToFile";
import { readFromFile } from "../utils/readFromFile";
import { Cookie } from "../types/cookie";
import path from 'path';

type CookieRecord = Record<string, Record<string, Cookie>>

const cookiesPath = path.join(__dirname, "../fixtures/cookies.json");

export async function persistCookie(name: string, sessionId: string, cookie: Cookie): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const existingFile = await readFromFile<CookieRecord>(cookiesPath)
                const updatedFile: CookieRecord = {
                    ...existingFile, 
                    [sessionId]: {
                        ...(existingFile[sessionId] || {} ),
                        [name]: cookie
                    }
                }
                await writeToFile(cookiesPath, updatedFile);
                resolve(); 
            } catch(err) {
                reject(err);
            }
        }, 200)
    })
}

// : Promise<Record<string, Cookie>>