import NewThread from '../NewThread.js';

describe('a NewThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'asda'
        };
        
        // Action & Assert
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            title: true, 
            body: 1241, 
            owner: 'asdsa'
        };

        // Action & Assert
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create NewThread object correctly', () => {
        // Arrange
        const payload = {
            title: 'abc', 
            body: 'abc', 
            owner: 'mighdad'
        }

        // Action
        const { title, body, owner } = new NewThread(payload);

        // Assert
        expect(title).toEqual('abc');
        expect(body).toEqual('abc');
        expect(owner).toEqual('mighdad');
    });
});