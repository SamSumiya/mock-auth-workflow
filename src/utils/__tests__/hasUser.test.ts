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
        // jest.clearAllTimers();
        // jest.useFakeTimers({ legacyFakeTimers: false });
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
        mockReadUserFile.mockResolvedValue(mockUserData)

        // Act 
        const result = await hasUser('abc@email.com')

        // Assert 
        expect(mockReadUserFile).toHaveBeenCalledTimes(1);
        expect(result).toBe(false)
    })

    it('should return false when file is empty', async () => {
        // Arrange
        mockReadUserFile.mockResolvedValue(null)

        // Act
        const result = await hasUser('test1@email.com')

        // Assert
        expect(result).toBe(false)
        expect(mockReadUserFile).toHaveBeenCalledTimes(1)
    })

    it ('should throw when file does not exist', async () => {
        // Arrange  
        const enoentErr = Object.assign(
            new Error('ENOENT: no such file or folder'),
            { code: 'ENOENT'}
        )

        mockReadUserFile.mockRejectedValue(enoentErr)

        // Act
        const result = await hasUser('rejectedUser@email.com')

        // Assert
        expect(result).toBe(false)
        expect(mockReadUserFile).toHaveBeenCalledTimes(1)
    })

    it('should return false when file contains empty object', async () => {
        // Arrange 
        mockReadUserFile.mockResolvedValue({})

        // Act
        const result = await hasUser('test1@email.com')

        // Assert 
        expect(result).toBe(false)
        expect(mockReadUserFile).toHaveBeenCalledTimes(1)
    })


    describe('handle timer', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });
        
        it('should not resolve before 150ms timeout is reached', async () => {
            // Arrange 
            // jest.useFakeTimers();

            const mockUser: Record<string, User> = {
            'test1@email.com': {
                userId: 'u1',
                firstname: 'Test',
                lastname: 'User1',
                email: 'test1@email.com',
                password: 'secret1'
                }
            };

            mockReadUserFile.mockResolvedValue(mockUser)

            // Act
            const promise = hasUser('test1@email.com');
        
           // Check that the promise is still pending before advancing time
            let isPending = true;
            promise.then(() => {
                isPending = false;
            });
        
            // Flush setup
            await Promise.resolve();
            expect(isPending).toBe(true);
        
            // Advance time
            jest.advanceTimersByTime(150);

            // Flush the remaining microtasks
            await Promise.resolve(); // Let the promise resolve
            const result = await promise;

            // Final checks
            expect(result).toBe(true);
            expect(isPending).toBe(false)
        }) 

         // Alternative simpler test - just verify setTimeout is called correctly
    it('should resolve after exactly 150ms delay', async () => {
            // Arrange
            const mockUser: Record<string, User> = {
                'test1@email.com': {
                    userId: 'u1',
                    firstname: 'Test',
                    lastname: 'User1',
                    email: 'test1@email.com',
                    password: 'secret1'
                }
            };
            
            mockReadUserFile.mockResolvedValue(mockUser);

            // Act
            const promise = hasUser('test1@email.com');

            // Let the setup complete
            await Promise.resolve();

            // Advance 149ms — not enough to resolve
            jest.advanceTimersByTime(149);
            await Promise.resolve();

            let resolved = false;
            promise.then(() => resolved = true);
            await Promise.resolve();
            
            expect(resolved).toBe(false); // Should still be pending

            // Advance 1 more ms (total 150ms)
            jest.advanceTimersByTime(1);
            await Promise.resolve();

            const result = await promise;
            expect(result).toBe(true);
            expect(resolved).toBe(true);
        }); 
    }) 
})