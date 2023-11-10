const GetThread = require('../../Domains/threads/entities/GetThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const getThread = new GetThread(useCasePayload);
    await this.threadRepository.verifyAvailableThread(getThread);
    const threads = await this.threadRepository.getThread(getThread);
    const comment = await this.commentRepository.getComment(getThread);
    return {
      ...threads,
      comments: comment,
    };
  }
}

module.exports = GetThreadUseCase;
