import fs from 'fs/promises'
import path, { join } from 'path'

import { User } from '../types/user'

const USERS_FILE = path.join(__dirname, './users.json')

export async function readFile(): Promise<Record<string, User> | null> {
    try {
        const rawData = await fs.readFile(USERS_FILE, 'utf-8') 
        const parsedData = JSON.parse(rawData) as Record<string, User>
        return parsedData
    } catch(err) {
        if ( err && 
            typeof err === 'object' && 
            'code' in err && 
            ( err as NodeJS.ErrnoException).code === 'ENOENT') {
            return{} 
        }
         throw err 
    }
}

