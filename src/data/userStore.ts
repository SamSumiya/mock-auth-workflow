// Node 
import fs from 'fs/promises'
import path, { join } from 'path'

// External 
import bcrypt from 'bcrypt'

// Local 
import { createId } from '../utils/helpers'
import { User } from '../types/user'
import { hasUser } from './utils/hasUser'
import { AddUserResult } from '../types/AddUserResult' 

const USERS_FILE = path.join(__dirname, './users.json')

export async function readUserFile(): Promise<Record<string, User> | null> {
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

export async function addUser(user: Omit<User, 'id'>): Promise<AddUserResult> {
    const { email, password } = user
    const userExists = await hasUser(email)

    if ( userExists ) {
        return { id: 'user_already_exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10) 

    const newUser = {
        ...user, 
        id: createId(),
        password: hashedPassword
    }

    let users: User[] = [];  
    try {
        const file = await readUserFile()
        users = file ? Object.values(file) : [] 
    } catch(err) {
        console.error(err)
    }

    try {
        users.push(newUser)
        const userRecord: Record<string, User> = Object.fromEntries( users.map( u => [
            u.id,
            u
        ]))
        await fs.writeFile(USERS_FILE, JSON.stringify(userRecord, null, 2)) 
        console.log(`User ${newUser.email} added with ID: ${newUser.id}`);
        return { id: newUser.id }
    } catch(err: any ) {
        console.error('Failed to write user data to file:', err.message);
        throw new Error('Internal server error: could not save user');
    }
}

