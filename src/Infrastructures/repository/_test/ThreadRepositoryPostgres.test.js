import ThreadTableTestHelper from "../../../../tests/ThreadTableTestHelper.js";
import NewThread from "../../../Domains/threads/entities/NewThread.js";
import AddedThread from "../../../Domains/threads/entities/AddedThread.js";
import pool from "../../database/postgres/pool.js";
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import NotFoundError from "../../../Commons/exceptions/NotFoundError.js";

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
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
            })
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            UsersTableTestHelper.addUser({});

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
            })
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

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
        it('should return thread according to id', async () => {
            // Arrange
            const newThread = new NewThread({
                title: 'thread title', 
                body: 'thread body', 
                owner: 'user-123', 
            })
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({});
            await threadRepositoryPostgres.addThread(newThread);

            // Action
            const thread = await threadRepositoryPostgres.findThreadById('thread-123');

            // Assert
            expect(thread).toHaveLength(1);
        });

        it('should throw NotFoundError when thread id is not found', async () => {
            // Arrange
            const newThread = new NewThread({
                title: 'thread title', 
                body: 'thread body', 
                owner: 'user-123', 
            })
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({});
            await threadRepositoryPostgres.addThread(newThread);

            // Action & Assert
            await expect(threadRepositoryPostgres.findThreadById('thread')).rejects.toThrowError(NotFoundError);
        });
    });
});