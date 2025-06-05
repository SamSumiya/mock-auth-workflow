import { createCookie } from "../cookieStore"


describe(('createCookie'), () => {
    it('create a new cookie with given value and expiresAt', () => {
        // Arrange
        const value = 'cookie'
        const now = Date.now()
        
        // Act 
        const result = createCookie(value, now)

        // Assert
        expect(result.value).toBe('cookie')
        expect(result.expiresAt).toBeGreaterThan(Date.now()) 
    })

    it('create a cookie with value and if no time is provided', () => {
        // Arrange & Act 
        const result = createCookie('justvaluenotime')
        
        // Assert
        expect(result.value).toBe('justvaluenotime')
        expect(result.expiresAt).toBeNull()
    })
})
