class DeletedComment {
  constructor(payload) {
    this.verifyPayload(payload);

    const { commentId } = payload;

    this.commentId = commentId;
  }

  verifyPayload({ commentId }) {
    if (!commentId) {
      throw Error('DELETED_COMMENT.NOT_NEEDED_PROPERTY');
    }
  }
}

module.exports = DeletedComment;
