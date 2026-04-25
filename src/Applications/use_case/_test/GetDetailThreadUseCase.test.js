import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import GetDetailThreadUseCase from '../GetDetailThreadUseCase.js';
import DetailedThread from '../../../Domains/threads/entities/DetailedThread.js';
import DetailedComment from '../../../Domains/comments/entities/DetailedComment.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';

describe('GetThreadUseCase', () => {
  it('should throw error if use case data header not contain needed data', async () => {
    // Arrange
    const useCaseData = {};
    const getDetailThreadUseCase = new GetDetailThreadUseCase({});

    // Action and Assert
    await expect(getDetailThreadUseCase.execute(useCaseData))
      .rejects
      .toThrowError('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_DATA');
  });

  it('should orchestrating the get thread action correctly', async () => {
    // Assert
    const useCaseData = {
      threadId: 'thread-123',
    };
    const mockDetailedThread = new DetailedThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding'
    });
    const detailedComment1 = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: new Date('2021-08-08T07:22:33.555Z'),
      content: 'sebuah comment'
    };
    const detailedComment2 = {
      id: 'comment-yksuCoxM2s4MMrZJO-qVD',
      username: 'dicoding',
      date: new Date('2021-08-08T07:26:21.338Z'),
      content: '**komentar telah dihapus**'
    };
    const mockDetailedComment = [
      detailedComment1,
      detailedComment2,
    ];

    /** Mocking */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getDetailThread = vi.fn()
      .mockImplementation(() => Promise.resolve(mockDetailedThread));
    mockCommentRepository.getCommentFromThread = vi.fn()
      .mockImplementation(() => Promise.resolve(mockDetailedComment));

    /** creating use case instace */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(useCaseData);

    // Assert
    expect(detailThread).toStrictEqual({
      thread: {
        ...new DetailedThread({
          id: 'thread-123',
          title: 'sebuah thread',
          body: 'sebuah body thread',
          date: '2021-08-08T07:19:09.775Z',
          username: 'dicoding'
        }),
        comments: [
          new DetailedComment({
            id: 'comment-_pby2_tmXV6bcvcdev8xk',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            content: 'sebuah comment'
          }),
          new DetailedComment({
            id: 'comment-yksuCoxM2s4MMrZJO-qVD',
            username: 'dicoding',
            date: '2021-08-08T07:26:21.338Z',
            content: '**komentar telah dihapus**'
          }),
        ]
      }
    });
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(useCaseData.threadId);
    expect(mockCommentRepository.getCommentFromThread).toBeCalledWith(useCaseData.threadId);
  });
});