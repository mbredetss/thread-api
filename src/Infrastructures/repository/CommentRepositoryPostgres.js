import AuthorizationError from "../../Commons/exceptions/AuthorizationError";
import NotFoundError from "../../Commons/exceptions/NotFoundError";
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

    async findCommentById(id) {
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1', 
            values: [id], 
        };

        const result = await this._pool.query(query);

        if (result.rowCount > 0) return result.rows;

        throw new NotFoundError('komentar tidak di temukan!');
    }

    async checkCommentOwner(commentData) {
        const { userId, commentId } = commentData;
        const query = {
            text: 'SELECT id FROM comments WHERE owner = $1 AND id = $2', 
            values: [userId, commentId], 
        };

        const result = await this._pool.query(query);

        if (result.rowCount > 0) return result.rows;

        throw new AuthorizationError('Anda tidak memiliki akses ke resource ini');
    }

    async deleteComment(id) {
        const query = {
            text: 'UPDATE comments SET "isDelete" = true WHERE id = $1', 
            values: [id], 
        };

        await this._pool.query(query);
    }
}

export default CommentRepositoryPostgres;