import AddedComment from '../AddedComment.js';

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Assert
    const payload = {
      id: 'comment-123',
      content: 'komentar'
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet type data spesification', () => {
    // Assert
    const payload = {
      id: 'comment-123',
      content: 123,
      owner: 'user-123'
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_TYPE_DATA_SPESIFICATION');
  });

  it('should create NewThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'konten',
      owner: 'user-123'
    };

    // Action
    const { id, content, owner } = new AddedComment(payload);

    // Assert
    expect(id).toEqual('comment-123');
    expect(content).toEqual('konten');
    expect(owner).toEqual('user-123');
  });
});