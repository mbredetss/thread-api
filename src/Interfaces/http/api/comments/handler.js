import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';
import AuthenticationError from '../../../../Commons/exceptions/AuthenticationError.js';

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
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

  async deleteCommentHandler(req, res) {
    const accessToken = this._accessToken(req);
    const threadId = req.params.threadId;
    const commentId = req.params.commentId;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    await deleteCommentUseCase.execute({
      accessToken,
      threadId,
      commentId,
    });

    res.status(200).json({
      status: 'success',
    });
  }

  _accessToken(req) {
    const token = req.headers.authorization;
    if (token && token.indexOf('Bearer ') !== -1) {
      return token.split('Bearer ')[1];
    }

    throw new AuthenticationError('Missing authentication');
  }
}

export default CommentsHandler;