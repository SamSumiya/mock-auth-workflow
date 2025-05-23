import fs from 'fs/promises'
import path from 'path'


export async function writeToFile<T>(selectedPath: string, data: T ): Promise<void> {
    try {
        const absPath = path.join(__dirname, selectedPath)
        await fs.writeFile(absPath, JSON.stringify(data, null, 2)) 
    } catch(err) {
        const error = err instanceof Error ? err : new Error(`Cannot write into ${selectedPath} file`)
        console.error(error)
    }
}