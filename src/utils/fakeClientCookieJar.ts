// import { login } from "../auth/session"

export const fakeClientCookieJar: Record<string, string> = {};  

// // TS does not like top level await 
// (async() => {
//     const sessionId = await login('sam_sumiya@example.com')
//     fakeClientCookieJar['sid123'] = sessionId   
//     console.log(fakeClientCookieJar)
// })() 
