import { cleanTempFiles, createTempFile } from "../manageTempFile"
import { readFromFile } from "../readFromFile"
import { writeToFile } from "../writeToFile"


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


})