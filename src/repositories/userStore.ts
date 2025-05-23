// Node 
import fs from 'fs/promises'
import path, { join } from 'path'

// External 
import bcrypt from 'bcryptjs'

// Local 
import { createId } from '../utils/helpers'
import { User, PublicUser } from '../types/user'
import { hasUser } from '../utils/hasUser'

import { AddUserResult } from '../types/AddUserResult' 
import { readFromFile } from '../utils/readFromFile'

const USERS_FILE = path.join(__dirname, '../fixtures/users.json')

export async function readUserFile(): Promise<Record<string, User> | null> {
    
    try {
        const parsedFileData = await readFromFile<Record<'string', User>>(USERS_FILE)
        return Object.keys(parsedFileData).length ? parsedFileData : {} 
        // const rawData = await fs.readFile(USERS_FILE, 'utf-8') 
        // if (!rawData.trim()) {
        //     // File exists but is empty or whitespace
        //     return {}
        // }

        // const parsedData = JSON.parse(rawData) as Record<string, User>
        // return parsedData
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

export async function addUser(user: Omit<User, 'id'>): Promise<PublicUser | AddUserResult | null> {
    const { email, password } = user
    const userExists = await hasUser(email)

    if ( userExists ) {
        return { message: 'user_already_exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10) 
    const userId = createId()

    const {password: _, ...publicProfile} = {
        ...user, 
        userId
    }

    const newUser = {
        ...publicProfile, 
        password: hashedPassword
    }

    try {
        const file = await readUserFile()
        const updatedFile = {  ...file, [email]: newUser, } 
        await fs.writeFile(USERS_FILE, JSON.stringify(updatedFile, null, 2 ))
        return publicProfile 
    } catch( err ) {
        const error = err instanceof Error ? err : new Error('Failed to add user to file')
        console.error(error)
        return null 
    }

    // ------------------------- previous way ------------------ ??
    // let users: User[] = [];  
    // try {
    //     const file = await readUserFile()
    //     users = file ? Object.values(file) : [] 
    // } catch(err) {
    //     console.error(err)
    // }

    // try {
    //     users.push(newUser)
    //     const userRecord: Record<string, User> = Object.fromEntries( users.map( u => [
    //         u.id,
    //         u
    //     ]))
    //     await fs.writeFile(USERS_FILE, JSON.stringify(userRecord, null, 2)) 
    //     console.log(`User ${newUser.email} added with ID: ${newUser.id}`);
    //     return { id, ...user }
    // } catch(err: any ) {
    //     console.error('Failed to write user data to file:', err.message);
    //     throw new Error('Internal server error: could not save user');
    // }
}

