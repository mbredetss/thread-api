import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadTableTestHelper from '../../../../tests/ThreadTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import NewComment from '../../../Domains/comments/entities/NewComment';
import pool from '../../database/postgres/pool.js';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js';

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
            await ThreadTableTestHelper.addThread({owner: 'user-123'});
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
            await ThreadTableTestHelper.addThread({owner: 'user-123'});
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
});