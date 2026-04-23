import { vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager.js';
import AddCommentUseCase from '../AddCommentUseCase.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import NewComment from '../../../Domains/comments/entities/NewComment.js';

describe('AddCommentUseCase', () => {
    it('should throw error if use case payload not contain access token', async () => {
        // Arrange
        const useCasePayload = {};
        const addCommentUseCase = new AddCommentUseCase({});

        // Action
        await expect(addCommentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('ADD_COMMENTS_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
    });

    it('should throw error if use case payload not contain thread id', async () => {
        // Arrange
        const useCasePayload = {
            accessToken: 'token'
        };
        const addCommentUseCase = new AddCommentUseCase({});

        // Action
        await expect(addCommentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('ADD_COMMENTS_USE_CASE.NOT_CONTAIN_THREAD_ID');
    });

    it('should orchestrating the new thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            accessToken: 'token',
            content: 'ini konten komentar',
            threadId: 'thread-123',
        };
        const mockAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: 'user-123'
        });

        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        /** Mocking */
        mockAuthenticationTokenManager.verifyAccessToken = vi.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.findThreadById = vi.fn()
            .mockImplementation(() => Promise.resolve());
        mockAuthenticationTokenManager.decodePayload = vi.fn()
            .mockImplementation(() => Promise.resolve({ id: 'user-123' }));
        mockCommentRepository.addComment = vi.fn()
            .mockImplementation(() => Promise.resolve(mockAddedComment));

        /** Create the use case instace */
        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
            authenticationTokenManager: mockAuthenticationTokenManager,
        });

        // Action
        const addedComment = await addCommentUseCase.execute(useCasePayload);

        // Assert
        expect(addedComment).toStrictEqual(mockAddedComment);
        expect(mockThreadRepository.findThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(useCasePayload.accessToken);
        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.accessToken);
        expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
            content: useCasePayload.content,
            owner: 'user-123', 
            threadId: 'thread-123'
        }));
    });
});