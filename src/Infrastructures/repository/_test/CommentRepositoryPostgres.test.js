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

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
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
            const newComment = new NewComment({
                content: 'ini konten',
                owner: 'user-123',
                threadId: 'thread-123'
            });
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            await commentRepositoryPostgres.addComment(newComment);

            // Action and Assert
            await expect(() => commentRepositoryPostgres.findCommentById('not-found-thread-id')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError when comments id is found', async () => {
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
            await commentRepositoryPostgres.addComment(newComment);

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
            const newComment = new NewComment({
                content: 'ini konten',
                owner: 'user-123',
                threadId: 'thread-123'
            });
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            await commentRepositoryPostgres.addComment(newComment);

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
            const newComment = new NewComment({
                content: 'ini konten',
                owner: 'user-123',
                threadId: 'thread-123'
            });
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            await commentRepositoryPostgres.addComment(newComment);

            // Action and Assert
            await expect(commentRepositoryPostgres.checkCommentOwner({
                userId: 'user-123',
                commentId: 'comment-123'
            })).resolves.not.toThrowError(AuthorizationError);
        });
    });

    describe('deleteComment function', () => {
        it('should delete comment correctly', async () => {
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
            await commentRepositoryPostgres.addComment(newComment);

            // Action
            await commentRepositoryPostgres.deleteComment('comment-123');
            const deletedComment =  await CommentsTableTestHelper.findCommentById('comment-123');
            
            // Assert
            expect(deletedComment[0].isDelete).toEqual(true);
        });
    })
});