jest.mock('fs/promises', () => ({
    readFile: jest.fn()
}))

import fs from 'fs/promises' 
import { readFromFile } from '../readFromFile'

const mockReadFile = fs.readFile as jest.Mock

afterEach(() => {
    jest.clearAllMocks()
})

describe(('readFromFile - data parsing'), ()=> {
    it('should return parsed data from file', async () => {
        // Arrange
        const testUser = { name: 'Sam' } 
        mockReadFile.mockResolvedValueOnce(JSON.stringify(testUser))
        
        // Act
        const result = await readFromFile<{name: string}>('testUser.json')

        // Assert 
        expect(mockReadFile).toHaveBeenCalledWith('testUser.json', 'utf-8')
        expect(result).toEqual(testUser)
        expect(result.name).toBe('Sam')
    })

    it ('should parse valid primitive JSON', async () => {
        // Arrange
        mockReadFile.mockResolvedValueOnce('123')

        // Act 
        const result = await readFromFile<number>('primivitive.json')

        // Assert
        expect(result).toBe(123)
    })

    it('Should return array when JSON is array', async () => {
        // Arrange
        const array = [ {id: 1}, {id: 2} ]
        mockReadFile.mockResolvedValueOnce(JSON.stringify(array)) 

        // Act
        const result = await readFromFile<Array<{id: number}>>('array.json')

        // Assert 
        expect(mockReadFile).toHaveBeenCalledWith('array.json', 'utf-8')
        expect(result).toEqual(array)
        expect(Array.isArray(result)).toBe(true)
        expect(result).toHaveLength(2)
        expect(result[0].id).toBe(1)
        expect(Object.keys(result)).toHaveLength(2)
    })

    it('Should return different values with sequential calls', async () => {
        // Arrange 
        const first = {id: 1} 
        const second = {id: 2}
        mockReadFile.mockResolvedValueOnce(JSON.stringify(first)) 
        mockReadFile.mockResolvedValueOnce(JSON.stringify(second)) 

        // Act 
        const one = await readFromFile<{id: number}>('one.json')
        const two = await readFromFile<{id: number}>('two.json') 

        // Assert
        expect(mockReadFile).toHaveBeenCalledTimes(2)
        expect(mockReadFile).toHaveBeenCalledWith('one.json', 'utf-8')
        expect(mockReadFile).toHaveBeenCalledWith('two.json', 'utf-8')

        expect(one.id).toBe(1)
        expect(two.id).toBe(2)
        expect(first).not.toEqual(two)
    })

    it ('should handle very large valid JSON', async () => {
        // Arrange 
        const largeObject = Array.from({length: 10000 }, (_, i) => ({id: i, name: `Name${i}`}))
        mockReadFile.mockResolvedValueOnce(JSON.stringify(largeObject))

        // Act
        const result = await readFromFile<Array<{id: number, name: string}>>('largeFile.json')

        // Assert
        expect(mockReadFile).toHaveBeenCalledWith('largeFile.json', 'utf-8')
        expect(mockReadFile).toHaveBeenCalledTimes(1)
        expect(result).toEqual(largeObject)
        expect(result).toHaveLength(10000)
        expect(Array.isArray(result)).toBe(true)
    })
})

describe('readFromFile - Edge Cases', () => {
    it('Should parse JSON data with white spaces around it', async () => {
        // Arrange 
        const testUser = {name: 'Sam II'}
        mockReadFile.mockResolvedValueOnce(`  \n ${JSON.stringify(testUser)}  \t `) 
        
        // Act
        const result = await readFromFile<{ name: string}>('whitespace.json') 

        // Assert
        expect(mockReadFile).toHaveBeenCalledWith('whitespace.json', 'utf-8') 
        expect(result).toEqual(testUser)
        expect(result.name).toBe('Sam II')
    })

    it('should return empty object with empty', async() => {
        // Arrange
        const input = '  \n  \t'
        mockReadFile.mockResolvedValueOnce(input)

        // Act
        const result = await readFromFile<typeof input>('empty.json')

        // Assert
        expect(mockReadFile).toHaveBeenCalledWith('empty.json', 'utf-8')
        expect(result).toEqual({})
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toHaveLength(0)
    })

    it ('should return empty object when file is completely empty', async () => {
        // Arrange 
        mockReadFile.mockResolvedValueOnce('') 
        
        // Act 
        const result = await readFromFile<Record<string, unknown>>('empty.json')

        // Assert 
        expect(mockReadFile).toHaveBeenCalledWith('empty.json', 'utf-8')
        expect(result).toEqual({})
        expect(typeof result).toBe('object') 
        expect(Object.keys(result)).toHaveLength(0)
    })
})

describe('readFromFile - Error Handling', () => {
    it('should return empty object for ENOENT file system errors', async () => { 
        // Arrange 
        const path = 'nonexists.json'
        const error = new Error('no file found') as NodeJS.ErrnoException
        error.code = 'ENOENT'
        mockReadFile.mockRejectedValueOnce(error)
        
        // Act
        const result = await readFromFile<{}>(path)

        expect(mockReadFile).toHaveBeenCalledWith(path, 'utf-8')
        expect(mockReadFile).toHaveBeenCalledTimes(1)
        expect(result).toEqual({}) 
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toHaveLength(0)
    })

    it('should handle null rejection', async() => {
        // Arrange 
        const nullError = null
        mockReadFile.mockRejectedValueOnce(nullError)
        
        // Act & Assert
        await expect(readFromFile('null.json')).rejects.toThrow(TypeError)
        expect(mockReadFile).toHaveBeenCalledWith('null.json', 'utf-8')
        expect(mockReadFile).toHaveBeenCalledTimes(1)
    })
    
    
    it ('should throw with invalid JSON data', async() => {
        // Arrange 
        const invalid = '{ "invalid" }'
        mockReadFile.mockResolvedValueOnce(invalid)

        // Act && Assert
        await expect(readFromFile('invalidJSON.json')).rejects.toThrow(SyntaxError)
        expect(mockReadFile).toHaveBeenCalledWith('invalidJSON.json', 'utf-8') 
    }) 

    it('should throw error for malformed JSON with extra characters', async () => { 
        // Arrange 
        const invalid = '{"name": "John"} extra text';
        mockReadFile.mockResolvedValueOnce(invalid)

        // Act && Assert
        await expect(readFromFile('malformed.json')).rejects.toThrow(SyntaxError)
        expect(mockReadFile).toHaveBeenCalledWith('malformed.json', 'utf-8') 
    }) 

    it('should handle permission denied errors (EACCES)', async () => {
        // Arrange
        const error = new Error('EACCES: permission denied') as NodeJS.ErrnoException
        error.code = 'EACCES'
        mockReadFile.mockRejectedValueOnce(error)

        // Act && Assert
        await expect(readFromFile('restricted.json')).rejects.toThrow('EACCES')
        expect(mockReadFile).toHaveBeenCalledWith('restricted.json', 'utf-8') 
    })

    it('should handle file too large errors(EFBIG)', async () => {
        // Arrange
        const error = new Error('EFBIG: file too big') as NodeJS.ErrnoException
        error.code = 'EFBIG'
        mockReadFile.mockRejectedValueOnce(error)

        // ACT && Assert
        await expect( readFromFile('large.json')).rejects.toThrow('EFBIG')
    })

})

