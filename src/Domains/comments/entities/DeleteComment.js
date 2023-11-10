class DeleteComment {
  constructor(payload) {
    this.verifyPayload(payload);

    const { id, owner, threadId } = payload;

    this.id = id;
    this.owner = owner;
    this.threadId = threadId;
  }

  verifyPayload({ id, owner, threadId }) {
    if (!id || !owner || !threadId) {
      throw Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = DeleteComment;
