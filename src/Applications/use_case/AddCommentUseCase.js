const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    const { threadId: id } = addComment;
    await this.threadRepository.verifyAvailableThread({ id });
    return this.commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
