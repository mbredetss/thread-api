import { vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager.js';
import DeleteCommentUseCase from '../DeleteCommentUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';

describe('DeleteCommentUseCase', () => {
    it('should throw error if use case data header not contain needed data', async () => {
        // Arrange
        const useCaseData = {
            threadId: 'thread-123'
        };
        const deleteCommentUseCase = new DeleteCommentUseCase({});

        // Action and Assert
        await expect(deleteCommentUseCase.execute(useCaseData))
            .rejects
            .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_DATA');
    });

    it('should throw error if use case data not contain access token', async () => {
        // Arrange
        const useCaseData = {
            threadId: 'thread-123', 
            commentId: 'comment-123', 
        };
        const deleteCommentUseCase = new DeleteCommentUseCase({});

        // Action and Assert
        await expect(deleteCommentUseCase.execute(useCaseData))
            .rejects
            .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
    });

    it('should orchestrating the delete authentication action correctly', async () => {
        // Arrange 
        const useCaseData = {
            accessToken: 'access-token', 
            threadId: 'thread-123', 
            commentId: 'comment-123'
        };
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        /** Mocking */
        mockThreadRepository.findThreadById = vi.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.findCommentById = vi.fn()
            .mockImplementation(() => Promise.resolve());
        mockAuthenticationTokenManager.verifyAccessToken = vi.fn()
            .mockImplementation(() => Promise.resolve());
        mockAuthenticationTokenManager.decodePayload = vi.fn()
            .mockImplementation(() => Promise.resolve({ id: 'user-123' }));
        mockCommentRepository.checkCommentOwner = vi.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteComment = vi.fn()
            .mockImplementation(() => Promise.resolve());

        /** Create the use case instace */
        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository, 
            commentRepository: mockCommentRepository, 
            authenticationTokenManager: mockAuthenticationTokenManager, 
        });

        // Action
        await deleteCommentUseCase.execute(useCaseData);

        // Assert
        await expect(mockThreadRepository.findThreadById).toHaveBeenCalledWith(useCaseData.threadId);
        await expect(mockCommentRepository.findCommentById).toHaveBeenCalledWith(useCaseData.commentId);
        await expect(mockAuthenticationTokenManager.verifyAccessToken).toHaveBeenCalledWith(useCaseData.accessToken);
        await expect(mockCommentRepository.checkCommentOwner).toHaveBeenCalledWith({
            userId: 'user-123', 
            commentId: 'comment-123'
        });
        await expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(useCaseData.commentId);
    });
});