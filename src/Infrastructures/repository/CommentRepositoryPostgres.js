import CommentRepository from "../../Domains/comments/CommentRepository";
import AddedComment from "../../Domains/comments/entities/AddedComment";

class CommentRepositoryPostgres extends CommentRepository{
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(newComment) {
        const { content, owner, threadId } = newComment;
        const id = `comment-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4) returning id, content, owner', 
            values: [id, content, owner, threadId], 
        };

        const result = await this._pool.query(query);
        const addedComment = new AddedComment({ ...result.rows[0] })

        return addedComment;
    }
}

export default CommentRepositoryPostgres;