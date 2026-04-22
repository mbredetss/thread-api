import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddThreadUseCase from '../AddThreadUseCase.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager.js';

describe('AddThreadUseCase', () => {
    it('should throw error if use case payload not contain access token', async () => {
        // Arrange
        const useCasePayload = {};
        const addThradAuthenticationUseCase = new AddThreadUseCase({});

        // Action & Assert
        await expect(addThradAuthenticationUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('ADD_THREAD_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');;
    });

    it('should orchestrating the new thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'thread title', 
            body: 'thread body', 
            accessToken: 'some_refresh_token',
        };
        const mockThreadRepository = new ThreadRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        // Mocking
        mockAuthenticationTokenManager.verifyAccessToken = vi.fn()
            .mockImplementation(() => Promise.resolve());
        mockAuthenticationTokenManager.decodePayload = vi.fn()
            .mockImplementation(() => Promise.resolve({ id: 'user-123' }));
        mockThreadRepository.addThread = vi.fn()
            .mockImplementation(() => Promise.resolve(new AddedThread({
                id: 'user-123', 
                title: useCasePayload.title, 
                owner: 'user-123', 
            })));

        // Create the use case instace
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository, 
            authenticationTokenManager: mockAuthenticationTokenManager, 
        });

        // Action
        const addedThread = await addThreadUseCase.execute(useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(new AddedThread({
            id: 'user-123', 
            title: useCasePayload.title, 
            owner: 'user-123',
        }));
        expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(useCasePayload.accessToken);
        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.accessToken);
        expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
            title: useCasePayload.title, 
            body: useCasePayload.body, 
            owner: 'user-123', 
        }));
    });
})