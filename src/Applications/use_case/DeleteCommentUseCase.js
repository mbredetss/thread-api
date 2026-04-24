class DeleteCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
    authenticationTokenManager,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._authenticationTokenManager= authenticationTokenManager;
  }

  async execute(useCaseData) {
    this._verifyData(useCaseData);

    const { accessToken, threadId, commentId } = useCaseData;
    await this._threadRepository.findThreadById(threadId);
    await this._commentRepository.findCommentById(commentId);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id } = await this._authenticationTokenManager.decodePayload(accessToken);
    await this._commentRepository.checkCommentOwner({
      userId: id,
      commentId,
    });
    await this._commentRepository.deleteComment(commentId);
  }

  _verifyData({ accessToken, threadId, commentId }) {
    if (!threadId || !commentId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_DATA');
    }
    if (!accessToken) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
    }
  }
}

export default DeleteCommentUseCase;