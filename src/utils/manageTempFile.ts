import fs from 'fs/promises'
import path from 'path'

import { randomUUID } from 'crypto'

const TEMP_DIR = path.join(__dirname, '__test__')

export async function createTempFile(data: string | object, filename?: string): Promise<string> {
    await fs.mkdir(TEMP_DIR, {recursive: true})

    const name = filename ?? `${randomUUID()}.json`
    const filePath = path.join( TEMP_DIR, name )

    const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2)

    await fs.writeFile(filePath, content, 'utf-8')
    return filePath
}

export async function cleanTempFiles(): Promise<void> {
    if ( !(await exists(TEMP_DIR))) return; 

    const files = await fs.readdir(TEMP_DIR)
    await Promise.all(files.map(file => fs.unlink(path.join(TEMP_DIR, file))))
    await fs.rmdir(TEMP_DIR)
}

async function exists(p: string): Promise<boolean> {
    try {
        await fs.access(p)
        return true
    } catch {
        return false
    }
}

