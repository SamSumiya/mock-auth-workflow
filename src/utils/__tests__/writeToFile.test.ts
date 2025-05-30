
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

        // Act 
        await writeToFile( path, data )
        
        // Assert 
        expect(mockWriteToFile).toHaveBeenCalledWith(path, JSON.stringify(data, null, 2), 'utf-8')
        expect(mockWriteToFile).toHaveBeenCalledTimes(1)
    })
})

describe('writeToFile - error handling', () => {

})
