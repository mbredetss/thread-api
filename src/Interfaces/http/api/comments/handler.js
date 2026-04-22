import AddCommentUseCase from "../../../../Applications/use_case/AddCommentUseCase";
import AuthenticationError from "../../../../Commons/exceptions/AuthenticationError";

class CommentsHandler {
    constructor(container) {
        this._container = container;

        this.postCommentHandler = this.postCommentHandler.bind(this);
    }

    async postCommentHandler(req, res) {
        const accessToken = this._accessToken(req);
        const content = req.body.content;
        const threadId = req.params.threadId;
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
        
        const addedComment = await addCommentUseCase.execute({
            accessToken, 
            content, 
            threadId, 
        });

        res.status(201).json({
            status: 'success', 
            data: {
                addedComment, 
            }
        });
    }

    _accessToken(req) {
        const token = req.headers.authorization;
        if (token && token.indexOf('Bearer ') !== -1) {
            return token.split('Bearer ')[1];
        }

        throw new AuthenticationError('access token tidak valid!');
    }
}

export default CommentsHandler;