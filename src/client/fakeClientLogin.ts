import { Session } from "../types/session";

import { fakeLogin } from "../auth/login";

async function fakeClientLogin() {
    const testingEmail = 'g_turner@example.com'
    const testingPassword = 'password123'
    const user = await fakeLogin(testingEmail, testingPassword) 
}