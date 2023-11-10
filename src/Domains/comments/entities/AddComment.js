class AddComment {
  constructor(payload) {
    this.verifyPayload(payload);

    const { content, owner, threadId } = payload;

    this.owner = owner;
    this.content = content;
    this.threadId = threadId;
  }

  verifyPayload({ owner, content, threadId }) {
    if (!owner || !content || !threadId) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof content !== 'string' || typeof threadId !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
