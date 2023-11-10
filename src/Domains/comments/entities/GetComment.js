class GetComment {
  constructor(payload) {
    this.verifyPayload(payload);
    const {
      id, username, date, content, is_delete: isDelete,
    } = payload;
    this.id = id;
    this.username = username;
    this.date = date;
    this.isDelete = Boolean(isDelete);
    this.content = isDelete === false ? content : '**komentar telah dihapus**';
  }

  verifyPayload({
    id, content, date, username,
  }) {
    if (!id || !content || !date || !username) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string') {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = GetComment;
