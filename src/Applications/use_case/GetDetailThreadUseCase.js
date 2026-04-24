class GetDetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }
  async execute(useCaseData) {
    this._verifyUseCaseData(useCaseData);

    const { threadId } = useCaseData;
    const detailThread = await this._threadRepository.getDetailThread(threadId);
    const detailComment = await this._commentRepository.getCommentFromThread(threadId);

    return {
      thread: {
        ...detailThread,
        comments: detailComment,
      }
    };
  }

  _verifyUseCaseData({ threadId }) {
    if (!threadId) throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_DATA');
  }
}

export default GetDetailThreadUseCase;