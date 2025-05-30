jest.mock('fs/promises', () => ({
    mkdir: jest.fn(), 
    writeFile: jest.fn()
}))

jest.mock('crypto', () => ({
    randomUUID: jest.fn() 
}))

import fs from 'fs/promises'
import crypto from 'crypto'
import { createTempFile, cleanTempFiles } from "../manageTempFile"

const mockMkdir = fs.mkdir as jest.Mock
const mockWriteFile = fs.writeFile as jest.Mock
const mockRandomUUID = crypto.randomUUID as jest.Mock


describe('createTempFile', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should create a new director and a file with given content', async () => {
        // Arrange 
        mockMkdir.mockResolvedValueOnce(undefined)
        mockWriteFile.mockResolvedValueOnce(undefined)

        // Act
        const result = await createTempFile('hello world', 'test.json') 

        // Assert 
        expect(mockMkdir).toHaveBeenCalledWith(
            expect.stringContaining('__test__'),
            {recursive: true}
        )

        expect(mockWriteFile).toHaveBeenCalledWith(
            expect.stringContaining('test.json'),
            'hello world', 
            'utf-8'
        ) 

        expect(result).toMatch(/__test__\/test\.json$/)
    })

    it('should get a name from randomUUID when file name is not provided', async () => {
        // Arrange 
        mockMkdir(undefined)
        mockWriteFile(undefined)
        // Watch out for mockReturn or mockResolved // 
        mockRandomUUID.mockReturnValueOnce('uniqname')

        // Act 
        const result = await createTempFile('hello world II') 

        // Assert 
        expect(mockMkdir).toHaveBeenCalledWith(
            expect.stringContaining('__test__'), 
            {recursive: true}
        )

        expect(mockWriteFile).toHaveBeenCalledWith(
            expect.stringContaining('uniqname'), 
            'hello world II', 
            'utf-8'
        )

        expect(result).toMatch(/__test__\/uniqname\.json$/)
    })  
    
})