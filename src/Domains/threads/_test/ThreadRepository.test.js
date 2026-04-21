import ThreadRepository from '../ThreadRepository.js';

describe('NewThreadRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const newThreadRepository = new ThreadRepository();

        // Action and Assert
        await expect(newThreadRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    })
});