import AddedThread from '../AddedThread.js';

describe('a AddedThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
            title: 'sebuah thread',
        };

        // Action & Assert
        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_PROPERTY');
    });

    it('should throw error when payload did not meet data spesification', () => {
        // Arrange
        const payload = {
            id: true, 
            title: 123, 
            owner: 'someone'
        };

        // Action & Assert
        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
    });

    it('should create AddedThread object correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-123', 
            title: 'thread title', 
            owner: 'mighdad',
        };

        // Action
        const { id, title, owner } = new AddedThread(payload);

        // Assert
        expect(id).toEqual('thread-123');
        expect(title).toEqual('thread title');
        expect(owner).toEqual('mighdad');
    });
});