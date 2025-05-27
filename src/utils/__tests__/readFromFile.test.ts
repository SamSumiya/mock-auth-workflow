import path from 'path'

import { createTempFile, cleanTempFiles } from "../manageTempFile"
import { readFromFile } from "../readFromFile"

afterEach(async() => {
    await cleanTempFiles()
})

describe('readFromFile', () => {
    it('should return parsed json data from file', async () => {
        const testData = { test: 'testing data'}
        const path = await createTempFile(testData)
        const fileData = await readFromFile<typeof testData>(path)

        expect(fileData).toEqual(testData)
    })

    it('Should return empty object if the file is empty', async() => {
        const filePath = await createTempFile('') 
        const file = await readFromFile(filePath) 

        expect( file ).toEqual({})
    }) 

    it('Should return empty object if files does not exist', async () => {
        const filePath = path.join(__dirname, '__temp__', 'nonExistingFile.json')
        const fileContent = await readFromFile<Record<string, unknown>>(filePath)

        expect(fileContent).toEqual({})
    }) 

    it('Should return error if contains invalid JSON', async () => {
        const invalidData = '{ Invald Data }';

        const invalidFile = await createTempFile(invalidData)
        await expect(readFromFile(invalidFile)).rejects.toThrow(SyntaxError); 
    })

    it('Should return empty object if it is empty file', async () => {
        const filePath = await createTempFile(' \n \t'); 
        const fileContent = await readFromFile<Record<string, unknown>>(filePath)
       
        expect(fileContent).toEqual({})
    })
})  
