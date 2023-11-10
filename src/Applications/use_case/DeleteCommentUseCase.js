const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this.commentRepository = commentRepository;
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    const { id: commentId, owner, threadId: id } = deleteComment;
    // const { owner } = deleteComment;
    // console.log(commentId);
    await this.threadRepository.verifyAvailableThread({ id });
    await this.commentRepository.verifyAvailableComment({ commentId, owner });
    return this.commentRepository.deleteComment({ commentId });
  }
}

module.exports = DeleteCommentUseCase;
