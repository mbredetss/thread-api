import { it } from 'vitest';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadTableTestHelper from '../../../../tests/ThreadTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import NewComment from '../../../Domains/comments/entities/NewComment';
import pool from '../../database/postgres/pool.js';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';
import DetailedComment from '../../../Domains/comments/entities/DetailedComment.js';

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persis new comment to the thread and return added comment correctly', async () => {
      // Assert
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({ owner: 'user-123' });
      const newComment = new NewComment({
        content: 'ini konten',
        owner: 'user-123',
        threadId: 'thread-123'
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Assert
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({ owner: 'user-123' });
      const newComment = new NewComment({
        content: 'ini konten',
        owner: 'user-123',
        threadId: 'thread-123'
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'ini konten',
        owner: 'user-123',
      }));
    });
  });

  describe('findCommentById function', () => {
    it('should throw NotFoundError when comments id is not found', async () => {
      // Assert
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({ owner: 'user-123' });
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => { });

      // Action and Assert
      await expect(() => commentRepositoryPostgres.findCommentById('not-found-thread-id')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comments id is found', async () => {
      // Assert
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({ owner: 'user-123' });
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => { });

      // Action and Assert
      await expect(commentRepositoryPostgres.findCommentById('comment-123'))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('checkCommentOwner function', () => {
    it('should throw AuthorizationError when comments not owned by the owner', async () => {
      // Assert
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({ owner: 'user-123' });
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => { });

      // Action and Assert
      await expect(commentRepositoryPostgres.checkCommentOwner({
        userId: 'user-225',
        commentId: 'comment-123'
      })).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comments owned by the owner', async () => {
      // Assert
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({ owner: 'user-123' });
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => { });

      // Action and Assert
      await expect(commentRepositoryPostgres.checkCommentOwner({
        userId: 'user-123',
        commentId: 'comment-123'
      })).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({ owner: 'user-123' });
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => { });

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');
      const deletedComment = await CommentsTableTestHelper.findCommentById('comment-123');

      // Assert
      expect(deletedComment[0].isDelete).toEqual(true);
    });
  });

  describe('getCommentFromThread function', () => {
    it('should return comment from thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({ owner: 'user-123' });
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({ id: 'comment-234' });
      await CommentsTableTestHelper.deleteComment('comment-234');

      const commentRepository = new CommentRepositoryPostgres(pool, () => { });

      // Action
      const comments = await commentRepository.getCommentFromThread('thread-123');

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments).toStrictEqual([
        new DetailedComment({
          id: 'comment-123',
          username: 'dicoding',
          date: comments[0].date,
          content: 'ini konten',
        }),
        new DetailedComment({
          id: 'comment-234',
          username: 'dicoding',
          date: comments[1].date,
          content: '**komentar telah dihapus**',
        }),
      ]);
    });
  });
});