import fs from 'fs/promises'

export async function readFromFile<T>(filePath: string): Promise<T> {
    const rawData = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(rawData) as T 
}