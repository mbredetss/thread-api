import NewComment from '../NewComment.js';

describe('a NewComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'asda',
        };

        // Action & Assert
        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet type data spesification', () => {
        // Arrange
        const payload = {
            content: 'komentar', 
            owner: 123, 
            threadId: 'thread-123',
        };

        // Action & Assert
        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
    });

    it('should create NewThread object correctly', () => {
        // Arrange
        const payload = {
            content: 'komentar', 
            owner: 'user-123', 
            threadId: 'thread-123'
        };

        // Action
        const { content, owner, threadId } = new NewComment(payload);

        // Assert
        expect(content).toEqual('komentar');
        expect(owner).toEqual('user-123');
        expect(threadId).toEqual('thread-123');
    });
});