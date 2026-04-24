import DetailedComment from '../DetailedComment.js';

describe('a DetailedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'comment-_pby2_tmXV6bcvcdev8xk',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
        };

        // Action and Assert
        expect(() => new DetailedComment(payload)).toThrowError('DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            username: true,
            date: {},
            content: []
        };

        // Action and Assert
        expect(() => new DetailedComment(payload)).toThrowError('DETAILED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create DetailedComment object correctly', () => {
        const payload = {
            id: 'comment-_pby2_tmXV6bcvcdev8xk',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            content: 'sebuah comment', 
        };

        // Action
        const detailedComment = new DetailedComment(payload);

        // Assert
        expect(detailedComment.id).toEqual('comment-_pby2_tmXV6bcvcdev8xk');
        expect(detailedComment.username).toEqual('johndoe');
        expect(detailedComment.date).toEqual('2021-08-08T07:22:33.555Z');
        expect(detailedComment.content).toEqual('sebuah comment');
    })
});