
jest.mock(('fs/promises'), () => ({
    writeFile: jest.fn() 
}))

import fs from 'fs/promises' 
import { writeToFile } from "../writeToFile"


const mockWriteToFile = fs.writeFile as jest.Mock

afterEach(() => {
    jest.clearAllMocks()
})

describe('writeToFile - parse data', () => {
    it ('should write data to file with correct path and content', async() => {
        // Arrange 
        const data = { name: 'Sam' } 
        const path = 'file.json'
        mockWriteToFile.mockResolvedValueOnce(undefined)

        // Act 
        await writeToFile( path, data )
        
        // Assert 
        expect(mockWriteToFile).toHaveBeenCalledWith(path, JSON.stringify(data, null, 2), 'utf-8')
        expect(mockWriteToFile).toHaveBeenCalledTimes(1)
    })
})

describe('writeToFile - error handling', () => {
    it ('should reject and throw when fs.write fails', async() => {
        // Arrange
        const error = new Error('EACCES: permission denied')
        mockWriteToFile.mockRejectedValueOnce(error)
        
        // Act && Assert
        await expect(writeToFile('defined.json', { a: '1' })).rejects.toThrow('EACCES: permission denied')
        expect(mockWriteToFile).toHaveBeenCalledTimes(1)
    })
})

describe('writeToFile - Edge Case(s)', () => {
    it ('should reject and throw when input value is undefined', async () => {
        // Arrange
        const undefinedError = undefined

        mockWriteToFile.mockRejectedValueOnce(undefinedError)

        // Act
        await expect(writeToFile('undefined.json', undefinedError)).rejects.toThrow('❌ Cannot write null or undefined to file: undefined.json')
    })
})
