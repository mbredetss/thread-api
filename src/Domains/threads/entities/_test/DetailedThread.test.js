import DetailedThread from '../DetailedThread.js';

describe('a DetailedThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'thread-123',
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date: '2021-08-08T07:19:09.775Z',
        };

        // Action and Assert
        expect(() => new DetailedThread(payload)).toThrowError('DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 'thread-123',
            title: true,
            body: 'sebuah body thread',
            date: 123,
            username: 'dicoding',
        };

        // Action and Assert
        expect(() => new DetailedThread(payload)).toThrowError('DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create DetailedThread object correctly', () => {
        const payload = {
            id: 'thread-123',
            title: 'sebuah title thread',
            body: 'sebuah body thread',
            date: 'date',
            username: 'dicoding',
        };

        // Action
        const detailedThread = new DetailedThread(payload);

        // Assert
        expect(detailedThread.id).toEqual('thread-123');
        expect(detailedThread.title).toEqual('sebuah title thread');
        expect(detailedThread.body).toEqual('sebuah body thread');
        expect(detailedThread.date).toEqual('date');
        expect(detailedThread.username).toEqual('dicoding');
    })
});