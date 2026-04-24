import ThreadTableTestHelper from '../../../../tests/ThreadTableTestHelper.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';
import pool from '../../database/postgres/pool.js';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import DetailedThread from '../../../Domains/threads/entities/DetailedThread.js';

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persis new thread and return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');

      await UsersTableTestHelper.addUser({});

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => '123');

      await UsersTableTestHelper.addUser({});

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: newThread.title,
        owner: newThread.owner,
      }));
    });
  });

  describe('findThreadById function', () => {
    it('should not throw NotFoundError when thread id is found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => { });

      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({ owner: 'user-123' });

      // Action and Assert
      await expect(threadRepositoryPostgres.findThreadById('thread-123'))
        .resolves.not.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when thread id is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => { });

      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({ owner: 'user-123' });

      // Action & Assert
      await expect(threadRepositoryPostgres.findThreadById('thread')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getDetailThread function', () => {
    it('should throw NotFoundError when thread id is not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({ owner: 'user-123' });
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({ id: 'user-234' });

      const threadRepository = new ThreadRepositoryPostgres(pool, () => { });

      // Action and Assert
      await expect(threadRepository.getDetailThread('not-found-thread-id')).rejects.toThrowError(NotFoundError);
    });

    it('should return detail thread by id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({ owner: 'user-123' });
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({ id: 'user-234' });

      const threadRepository = new ThreadRepositoryPostgres(pool, () => { });

      // Action
      const detailThread = await threadRepository.getDetailThread('thread-123');

      // Assert
      expect(detailThread).toStrictEqual(new DetailedThread({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        date: detailThread.date,
        username: 'dicoding'
      }));
    });
  });
});