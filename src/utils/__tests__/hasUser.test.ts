jest.mock("../../services/userStore", () => ({
    readUserFile: jest.fn() 
}))

import { hasUser } from "../hasUser";
import { readUserFile } from "../../services/userStore";
import { User } from "../../types/user";

const mockReadUserFile = readUserFile as jest.MockedFunction<typeof readUserFile>

describe('hasUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Clear any existing timers
        jest.clearAllTimers();
    })

    afterEach(() => {
        jest.useRealTimers();
    })

    it('should return an user info if the user exists', async () => {
        // Arrange 
        const mockUserData: Record<string, User> = {
             'test1@email.com': {
                userId: 'u1',
                firstname: 'Test',
                lastname: 'User1',
                email: 'test1@email.com',
                password: 'secret1'
            },
            'test2@email.com': {
                userId: 'u2',
                firstname: 'Test',
                lastname: 'User2',
                email: 'test2@email.com',
                password: 'secret2'
            }
        }
        mockReadUserFile.mockResolvedValue(mockUserData)

        // Act
        const result = await hasUser('test1@email.com')
        jest.advanceTimersByTime(150);

        // Assert 
        expect(result).toBe(true)
        expect(mockReadUserFile).toHaveBeenCalledTimes(1)
    })

    it('should return false when user can not be found in users file', async() => {
        // Arrange
        const mockUserData: Record<string, User> = {
           'nonexistsuser@email.com': {
                userId: 'unknow',
                firstname: 'Test',
                lastname: 'nonexistant',
                email: 'nonexistant@email.com',
                password: 'secret2'
            }
        }
        mockReadUserFile.mockRejectedValue(mockUserData)

        // Act 
        const result = await hasUser('abc@email.com')

        // Assert 
        expect(mockReadUserFile).toHaveBeenCalledTimes(1);
        expect(result).toBe(false)
    })

})