class GetedThread {
  constructor(payload) {
    this.verifyPayload(payload);

    const {
      id, date, title, body, username,
    } = payload;

    this.id = id;
    this.date = date;
    this.title = title;
    this.body = body;
    this.username = username;
  }

  verifyPayload({
    id, date, title, body, username,
  }) {
    if (!id || !date || !title || !body || !username) {
      throw new Error('GETED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof date !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof username !== 'string') {
      throw new Error('GETED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetedThread;
