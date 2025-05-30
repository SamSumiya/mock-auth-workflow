jest.mock('fs/promises', () => ({
    mkdir: jest.fn(), 
    writeFile: jest.fn()
}))

import fs from 'fs/promises'
import { createTempFile, cleanTempFiles } from "../manageTempFile"

const mockMkdir = fs.mkdir as jest.Mock
const mockWriteFile = fs.writeFile as jest.Mock

describe('createTempFile', () => {
    it('should create a new director and a file', async () => {
        mockMkdir.mockResolvedValueOnce(undefined)
        mockWriteFile.mockResolvedValueOnce(undefined)

        await createTempFile('myFolder', 'test.json') 

        expect(mockMkdir).toHaveBeenCalled()
        expect(mockWriteFile).toHaveBeenCalled() 
    })
})