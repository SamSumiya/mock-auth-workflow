import fs from 'fs/promises'

export async function readFromFile<T>(filePath: string): Promise<T> {
    try {
         const rawData = await fs.readFile(filePath, 'utf-8')
        if (!rawData.trim()) {
            return {} as T 
        }
    return JSON.parse(rawData) as T 
    } catch( err ) {
        const error = err as NodeJS.ErrnoException
        
        if (error.code === 'ENOENT') {
            return {} as T
        }
        console.log(`❌ Failed to read or parse file at ${filePath}`, error)
        throw err 
    }   
}