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


describe('createTempFile - success', () => {
    afterEach(() => {
        jest.clearAllMocks()
    }) 

    it('should create a new directory and a file with given content', async () => {
        // Arrange 
        mockMkdir.mockResolvedValueOnce(undefined)
        mockWriteFile.mockResolvedValueOnce(undefined)

        // Act
        const result = await createTempFile('hello world', 'test.json') 

        // Assert
        expect(mockMkdir).toHaveBeenCalledTimes(1)
        expect(mockWriteFile).toHaveBeenCalledTimes(1)

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
        mockMkdir.mockResolvedValueOnce(undefined)
        mockWriteFile.mockResolvedValueOnce(undefined)
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

describe('createTempFile - fail' , () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should reject when the file name already exists', async() => {
        // Arrange
        const eexistError = Object.assign(
            new Error('EEXIST: Directory already exists'), 
            { code: 'EEXIST'}
        ) as NodeJS.ErrnoException
        // less preferred  
        // const eexistError = new Error('EEXIST: Directory already exists') as NodeJS.ErrnoException
        // eexistError.code = 'EEXIST'

        mockMkdir.mockRejectedValueOnce(eexistError)

        // Act 
        const promise = createTempFile('hello');

        // Asssert 
        await expect(promise).rejects.toThrow('EEXIST')
        await expect(promise).rejects.toMatchObject({ code: 'EEXIST'})
        await expect(mockWriteFile).not.toHaveBeenCalled()
    })

    it ('should throw an ENOENT error when a parent directory does not exist', async () => {
        // Arrange 
        const enoentError = Object.assign(
            new Error('ENOENT: No Dir nor no file'), 
            {code: 'ENOENT'} 
        ) as NodeJS.ErrnoException

        mockMkdir.mockRejectedValueOnce(enoentError)

        // Act
        const promise = createTempFile('hello enoent')

        // Assert
        await expect(promise).rejects.toThrow('ENOENT: No Dir nor no file')
        await expect(promise).rejects.toMatchObject({
            message: expect.stringContaining('ENOENT'),
            code: 'ENOENT'
        });
    })

    it ('should throw an EACCES error when there is a permission issue', async () => {
        // Arrange 
        const eaccesError = Object.assign(
            new Error('EACCES: no permission'), 
            { code: 'EACCES'} 
        ) as NodeJS.ErrnoException 

        mockMkdir.mockRejectedValueOnce(eaccesError)

        // Act 
        const promise = createTempFile('hello EACCES')

        // ASSERT
        await expect(promise).rejects.toThrow('EACCES: no permission')
        await expect(promise).rejects.toMatchObject({
            message: expect.stringContaining('EACCES: no permission'), 
            code: 'EACCES'
        })
    })
})