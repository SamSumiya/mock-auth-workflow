jest.mock('fs/promises', () => ({
    readFile: jest.fn() 
}))  

import fs from 'fs/promises'
import { readFromFile } from '../readFromFile'

const mockReadFile = fs.readFile as jest.Mock 

describe('readFromFile', () => {
    afterEach(() => {
        jest.clearAllMocks() 
    })

    it('Should parse and return JSON data from working file', async () => {
        const data = {name : "Sam"}
        
        mockReadFile.mockResolvedValueOnce(JSON.stringify(data)) 
        
        const res = await readFromFile<typeof data>('dummy/path.json') 

        expect(mockReadFile).toHaveBeenCalledWith('dummy/path.json', 'utf-8')
        expect(res).toEqual( data )
    })
})