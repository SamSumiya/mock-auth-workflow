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

    it('Should parse data and return user', async () => {
        const user = { name: 'Sam' } 

        mockReadFile.mockResolvedValueOnce(JSON.stringify(user)) 
        const data = await readFromFile<typeof user>('mock/data.json')

        expect(mockReadFile).toHaveBeenCalledWith('mock/data.json', 'utf-8')
        expect(data).toEqual(user) 
    })

    it ('Should parse and return an array with JSONs', async () => {
        const arr = [{ name: 'Sam' } , {name: 'Grace'}]

        mockReadFile.mockResolvedValueOnce(JSON.stringify(arr)) 

        const response = await readFromFile<typeof arr>('mock/array.json')

        expect(mockReadFile).toHaveBeenCalledWith('mock/array.json', 'utf-8')
        expect(response).toEqual(arr)
    })  

    it('Should handle deeply nested JSON', async () => {
        const data = { user: { profile: { name: 'Sam' } } };
        mockReadFile.mockResolvedValueOnce(JSON.stringify(data));

        const result = await readFromFile<typeof data>('deep.json');

        expect(result).toEqual(data);
    });


    it('Should return an empty object with empty input', async () => {
        const input = ' \n \t'; 

        mockReadFile.mockResolvedValueOnce(input) 
        const response = await readFromFile('mock/data.json')

        expect(mockReadFile).toHaveBeenCalledWith('mock/data.json', 'utf-8')
        expect(response).toEqual({})
    })  

    it ('Should return an empty object when the file does not exist - ENOENT', async () => {
        const filePath = 'nonexistent.json';
        
        const err = new Error('No file found') as NodeJS.ErrnoException
        err.code = 'ENOENT'

        mockReadFile.mockRejectedValue(err)

        const result = await readFromFile(filePath) 

        expect(mockReadFile).toHaveBeenCalledWith(filePath, 'utf-8') 
        expect(result).toEqual({})
    })

})