import path from 'path'

import { readFromFile } from '../readFromFile'
import { createTempFile, cleanTempFiles } from '../manageTempFile'

const testDir = path.join(__dirname, '__temp__')
const testFile = (name: string) => path.join(testDir, name)

// beforeAll(async() => {})

afterAll(async () => {
    await cleanTempFiles()
})

describe('readFromFile', () => {
    it('read a valid JSON file', async () => {
        const data = {foo: 'bar'}
        const filePath = await createTempFile(data)

        const result = await readFromFile<typeof data>(filePath)
        expect(result).toEqual(data)
    })  

    it('returns an empty object when the file is empty', async () => {
        const filePath = await createTempFile('')

        const result = await readFromFile<Record<string, unknown>>(filePath)
        expect(result).toEqual({})
    })
})