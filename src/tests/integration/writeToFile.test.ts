import path from 'path'
import { cleanTempFiles, createTempFile } from '../../utils/manageTempFile'
import { writeToFile } from '../../utils/writeToFile'
import { readFromFile } from '../../utils/readFromFile'


afterEach(async () => {
    await cleanTempFiles()
})


describe('writeToFile', () => {
    it('should write the user data to file correctly', async () => {
        const user = {name:'Sam', age: 38}
        const filePath = await createTempFile('')

        await writeToFile(filePath, user)

        const data = await readFromFile<typeof user>(filePath)
        expect(data).toEqual(user)
    })

    it('Should reject circular reference', async () => {
        const circular: any = {}
        circular.self = circular 

        const filePath = await createTempFile('')

        await expect(writeToFile(filePath, circular)).rejects.toThrow(TypeError)
    })

    it('show thow if the path is invalid', async () => {
        const invalidPath = path.join('/invalid-path', 'file.json')
        await expect( writeToFile(invalidPath, {})).rejects.toThrow()
    })
})