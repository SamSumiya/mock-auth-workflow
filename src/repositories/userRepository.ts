import { User } from "../types/user";
import { fakeUsers } from "../data/fakeUserStore"

export function fakeFetchUserByEmail(email: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
        const response = fakeUsers[email] 
        setTimeout(() => {
            if (response) {
                resolve( response )
            } else {
                reject(new Error('User not found...'))
            }
        }, 150 )
    })
}