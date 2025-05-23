import { Session } from "../types/session"
import fs from 'fs'
import path from 'path'


// export const SESSION_FILE = "session.json";

export const sessionFilePath = path.join(__dirname, '../fixtures/session.json')

let raw = '' 

try {
  raw = fs.readFileSync(sessionFilePath, 'utf-8').trim(); 
} catch(err) {
  if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
    raw = '{}'
  } else {
    throw err 
  }
}

export const fakeSessionStore: Record<string, Session> = raw ? JSON.parse(raw) : {} 


// export const fakeSessionStore: Record<string, Session> = fs.existsSync(sessionFilePath)
//   ? JSON.parse(fs.readFileSync(sessionFilePath, "utf-8"))
//   : {};
