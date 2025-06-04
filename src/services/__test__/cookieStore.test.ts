jest.mock(('../cookieStore'), () => ({
    setCookie: jest.fn()
}))

import { Cookie } from "../../types/cookie"
import { cookieStore, setCookie } from "../cookieStore"
import { persistCookie } from "../../repositories/cookieRepository"

const mockSetCookie = setCookie as jest.MockedFunction<typeof setCookie>

describe(('setCookie'), () => {
    
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('writes cookie and calls persistCookie', async () => {
        // Arrange && Act  
        await setCookie('abc', 'sid', 'abc', 1000)

        // Assert 
        expect(cookieStore['abc']['sid'].value).toBe('abc') 
        expect(cookieStore['abc']['sid'].expiresAt).toBeGreaterThan(Date.now())
        expect(persistCookie).toHaveBeenCalled();
    })
})
