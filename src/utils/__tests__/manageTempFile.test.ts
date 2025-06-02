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

const mockMkdir = fs.mkdir as jest.MockedFunction<typeof fs.mkdir>;
const mockWriteFile = fs.writeFile as jest.MockedFunction<typeof fs.writeFile>;
const mockRandomUUID = crypto.randomUUID as jest.MockedFunction<typeof crypto.randomUUID>

describe('createTempFile', () => {
    afterEach(() => {
        jest.clearAllMocks()
    }) 

    describe('success cases ', () => {
        it('should create a new directory and a file with given content', async () => {
            // Arrange 
            mockMkdir.mockResolvedValueOnce(undefined)
            mockWriteFile.mockResolvedValueOnce(undefined)

            // Act
            const result = await createTempFile('hello world', 'test.json') 

            // Assert
            expect(mockMkdir).toHaveBeenCalledTimes(1)
            expect(mockMkdir).toHaveBeenCalledWith(
                expect.stringContaining('__test__'),
                {recursive: true}
            )

            expect(mockWriteFile).toHaveBeenCalledTimes(1)
            expect(mockWriteFile).toHaveBeenCalledWith(
                expect.stringContaining('test.json'),
                'hello world', 
                'utf-8'
            ) 

            expect(result).toMatch(/__test__\/test\.json$/)
        })

        it('should get a name from randomUUID when file name is not provided', async () => {
            // Arrange 
            const fakeID = '123e4567-e89b-12d3-a456-426614174000'
            mockMkdir.mockResolvedValueOnce(undefined)
            mockWriteFile.mockResolvedValueOnce(undefined)
            // Watch out for mockReturn or mockResolved // 
            mockRandomUUID.mockReturnValue(fakeID)

            // Act 
            const result = await createTempFile('hello world II') 

            // Assert 
            expect(mockMkdir).toHaveBeenCalledWith(
                expect.stringContaining('__test__'), 
                {recursive: true}
            )

            expect(mockWriteFile).toHaveBeenCalledWith(
                expect.stringContaining(fakeID), 
                'hello world II', 
                'utf-8'
            )

            expect(result).toMatch(new RegExp(`__test__\\/${fakeID}\\.json$`)) 
        })  
    })

    describe('error cases' , () => {
        it('should reject when the file name already exists - EEXIST', async() => {
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
            await expect(promise).rejects.toMatchObject({ 
                code: 'EEXIST',
                message: 'EEXIST: Directory already exists'
            })
            expect(mockWriteFile).not.toHaveBeenCalled()
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
})



