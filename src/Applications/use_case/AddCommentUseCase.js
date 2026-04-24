import NewComment from '../../Domains/comments/entities/NewComment.js';

class AddCommentUseCase {
  constructor({
    commentRepository,
    threadRepository,
    authenticationTokenManager,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    const { accessToken, content, threadId } = useCasePayload;
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    await this._threadRepository.findThreadById(threadId);
    const { id } = await this._authenticationTokenManager.decodePayload(accessToken);
    return await this._commentRepository.addComment(new NewComment({
      content,
      owner: id,
      threadId
    }));
  }

  _verifyPayload(payload) {
    const { accessToken, threadId } = payload;

    if (!accessToken) {
      throw new Error('ADD_COMMENTS_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
    }
    if (!threadId) {
      throw new Error('ADD_COMMENTS_USE_CASE.NOT_CONTAIN_THREAD_ID');
    }
  }
}

export default AddCommentUseCase;