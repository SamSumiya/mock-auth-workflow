export type User = {
    id: string, 
    firstname: string,
    lastname: string,
    email: string, 
    password: string, 
}

export type PublicUser = Omit<User, 'password'>
export type PreRegisterUser = Omit<User, 'id'> 