class AddedComment {
  constructor(payload) {
    this.verifyPayload(payload);

    const {
      id, owner, content, threadId, date,
    } = payload;

    this.id = id;
    this.owner = owner;
    this.threadId = threadId;
    this.content = content;
    this.date = date;
  }

  verifyPayload({
    id, owner, content, threadId, date,
  }) {
    if (!id || !owner || !content || !threadId || !date) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string' || typeof content !== 'string' || typeof threadId !== 'string' || typeof date !== 'string') {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
