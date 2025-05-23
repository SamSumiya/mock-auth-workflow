export type User = {
    userId: string, 
    firstname: string,
    lastname: string,
    email: string, 
    password: string, 
}

export type PublicUser = Omit<User, 'password'>
export type PreRegisterUser = Omit<User, 'id'> 
export type LoginCredentials = Pick<User, 'email' | 'password'>
