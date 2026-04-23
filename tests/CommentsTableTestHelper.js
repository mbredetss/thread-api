import pool from "../src/Infrastructures/database/postgres/pool";

/* istanbul ignore file */
const CommentsTableTestHelper = {
    async findCommentById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1', 
            values: [id], 
        };

        const result = await pool.query(query);
        return result.rows;
    }, 

    async addComment({
        id = 'comment-123', 
        content = 'ini konten', 
        owner = 'user-123', 
        threadId = 'thread-123',
    }) {
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4)', 
            values: [id, content, owner, threadId], 
        };

        await pool.query(query);
    }, 

    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    }
}

export default CommentsTableTestHelper;