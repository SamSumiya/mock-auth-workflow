import { Session } from "../types/session"
import fs from 'fs'

export const SESSION_FILE = "session.json";

export const fakeSessionStore: Record<string, Session> = fs.existsSync(SESSION_FILE)
  ? JSON.parse(fs.readFileSync(SESSION_FILE, "utf-8"))
  : {};
