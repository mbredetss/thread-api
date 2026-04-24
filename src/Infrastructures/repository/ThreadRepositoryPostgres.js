import NotFoundError from "../../Commons/exceptions/NotFoundError";
import AddedThread from "../../Domains/threads/entities/AddedThread";
import DetailedThread from "../../Domains/threads/entities/DetailedThread";
import ThreadRepository from "../../Domains/threads/ThreadRepository";

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(newThread) {
        const { title, body, owner } = newThread;
        const id = `thread-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
            values: [id, title, body, owner],
        };

        const result = await this._pool.query(query);

        return new AddedThread({ ...result.rows[0] });
    }

    async findThreadById(id) {
        const query = {
            text: 'SELECT id FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (result.rowCount > 0) return result.rows;

        throw new NotFoundError('thread tidak ditemukan!');
    }

    async getDetailThread(id) {
        const query = {
            text: `SELECT t.id, title, body, "createdAt" as date, username
                FROM threads as t JOIN users as u ON u.id = owner
                WHERE t.id = $1`, 
            values: [id], 
        };

        const result = await this._pool.query(query);

        if (result.rowCount > 0) {
            const date = result.rows[0].date;
            return new DetailedThread({
                ...result.rows[0], 
                date: date.toISOString(), 
            });
        }

        throw new NotFoundError('thread tidak ditemukan!');
    }
}

export default ThreadRepositoryPostgres;