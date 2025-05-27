import { readUserFile } from "../services/mockUserStore"

export async function hasUser(email: string): Promise<boolean> {    
    try {
        const file = await readUserFile();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(!!file?.[email])
            }, 150)
        })
    } catch(err) {
        return false 
    }
}