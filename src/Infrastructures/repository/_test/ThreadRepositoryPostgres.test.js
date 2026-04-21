import ThreadTableTestHelper from "../../../../tests/ThreadTableTestHelper.js";
import NewThread from "../../../Domains/threads/entities/NewThread.js";
import AddedThread from "../../../Domains/threads/entities/AddedThread.js";
import pool from "../../database/postgres/pool.js";
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
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

            UsersTableTestHelper.addUser({});

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
});