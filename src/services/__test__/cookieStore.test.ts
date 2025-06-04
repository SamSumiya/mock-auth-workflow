import { createCookie } from "../cookieStore"


describe(('createCookie'), () => {
    it('create a new cookie with guven value and expiresAt', () => {
        // Arrange
        const value = 'cookie'
        const now = Date.now()
        
        // Act 
        const result = createCookie(value, now)

        // Assert
        expect(result.value).toBe('cookie')
        expect(result.expiresAt).toBeGreaterThan(Date.now()) 
    })

    
})
