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

    it('Should return parsed data from file', async () => {
        const user = { name: "Sam" } 
        
        mockReadFile.mockResolvedValueOnce(JSON.stringify(user)) 
        const data = await readFromFile<typeof user>('mock/users.json')

        expect(mockReadFile).toHaveBeenCalledWith('mock/users.json', 'utf-8')
        expect(data).toEqual(user)
    })

    it('Should return {} with empty file', async () => {
        const inputFile = '   \n  \t'

        mockReadFile.mockResolvedValueOnce(inputFile)
        const data = await readFromFile('mock/users.json')

        expect(mockReadFile).toHaveBeenCalledWith('mock/users.json', 'utf-8')
        expect(data).toEqual({})
    })  

    it('Should return array when JSON is array', async() => {
        const users = [ {id: 1}, {id: 2} ]

        mockReadFile.mockResolvedValueOnce(JSON.stringify(users)) 
        
        const response = await readFromFile<typeof users>('users.json')
        expect(mockReadFile).toHaveBeenCalledWith('users.json', 'utf-8' )
        expect(response.length).toBe(2)
        expect(response[0].id).toBe(1)
        expect(Array.isArray(response)).toBe(true)
    })

    it('Should parse JSON data with white spaces around it', async () => {
        const obj = { name: 'Trimmed' }; 
        const input = ` \n  ${JSON.stringify(obj)}  \t`

        mockReadFile.mockResolvedValueOnce(input)
        const response = await readFromFile<typeof obj>('trimmed.json')

        expect(mockReadFile).toHaveBeenCalledWith('trimmed.json', 'utf-8')
        expect(response).toEqual(obj) 

    })

    it ('Should return an empty object when the file does not exist - ENOENT', async () => {
        const filepath = 'nonexistant.json'

        const error = new Error() as NodeJS.ErrnoException
        error.code = 'ENOENT';
        mockReadFile.mockRejectedValueOnce(error)

        const data = await readFromFile(filepath)

        expect(mockReadFile).toHaveBeenCalledWith(filepath, 'utf-8');
        expect(data).toEqual({})
    }) 

    it('Should reject if the input data is invalid', async() => {
        const err = new Error('something went wrong') 

        mockReadFile.mockRejectedValueOnce(err)

        await expect(readFromFile('invalid.json')).rejects.toThrow("something went wrong")
    })

    it('Should different values with sequential calls', async () => {
        const first = {id: 1} 
        const second = {id: 2}

        mockReadFile
            .mockResolvedValueOnce(JSON.stringify(first))
            .mockResolvedValueOnce(JSON.stringify(second)) 

        const one = await readFromFile<typeof first>('a.json')
        const two = await readFromFile<typeof second>('b.json')

        expect(mockReadFile).toHaveBeenCalledWith('a.json', 'utf-8')
        expect(one).toEqual(first)
        expect(mockReadFile).toHaveBeenCalledWith('b.json', 'utf-8')
        expect(second).toEqual(two)

    })

    it('Should throw if JSON is invalid (no braces)', async () => {
        mockReadFile.mockResolvedValueOnce('invalid json');

        await expect(readFromFile('bad.json')).rejects.toThrow(SyntaxError);
    });

})


// jest.mock('fs/promises', () => ({
//     readFile: jest.fn()
// }))

// import fs from 'fs/promises'
// import { readFromFile } from '../readFromFile'

// const mockReadFile = fs.readFile as jest.Mock

// describe('readFromFile', () => {
//     afterEach(() => {
//         jest.clearAllMocks()
//     })

//     it('Should parse data and return user', async () => {
//         const user = { name: 'Sam' } 

//         mockReadFile.mockResolvedValueOnce(JSON.stringify(user)) 
//         const data = await readFromFile<typeof user>('mock/data.json')

//         expect(mockReadFile).toHaveBeenCalledWith('mock/data.json', 'utf-8')
//         expect(data).toEqual(user) 
//     })

//     it ('Should parse and return an array with JSONs', async () => {
//         const arr = [{ name: 'Sam' } , {name: 'Grace'}]

//         mockReadFile.mockResolvedValueOnce(JSON.stringify(arr)) 

//         const response = await readFromFile<typeof arr>('mock/array.json')

//         expect(mockReadFile).toHaveBeenCalledWith('mock/array.json', 'utf-8')
//         expect(response).toEqual(arr)
//     })  

//     it('Should handle deeply nested JSON', async () => {
//         const data = { user: { profile: { name: 'Sam' } } };
//         mockReadFile.mockResolvedValueOnce(JSON.stringify(data));

//         const result = await readFromFile<typeof data>('deep.json');

//         expect(result).toEqual(data);
//     });


//     it('Should return an empty object with empty input', async () => {
//         const input = ' \n \t'; 

//         mockReadFile.mockResolvedValueOnce(input) 
//         const response = await readFromFile('mock/data.json')

//         expect(mockReadFile).toHaveBeenCalledWith('mock/data.json', 'utf-8')
//         expect(response).toEqual({})
//     })  

//     it ('Should return an empty object when the file does not exist - ENOENT', async () => {
//         const filePath = 'nonexistent.json';
        
//         const err = new Error('No file found') as NodeJS.ErrnoException
//         err.code = 'ENOENT'

//         mockReadFile.mockRejectedValue(err)

//         const result = await readFromFile(filePath) 

//         expect(mockReadFile).toHaveBeenCalledWith(filePath, 'utf-8') 
//         expect(result).toEqual({})
//     })

// })
