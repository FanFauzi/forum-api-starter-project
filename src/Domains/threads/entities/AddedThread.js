class AddedThread {
  constructor(payload) {
    this.verifyPayload(payload);

    const {
      id, owner, title, body,
    } = payload;

    this.id = id;
    this.owner = owner;
    this.title = title;
    this.body = body;
  }

  verifyPayload({
    id, owner, title, body,
  }) {
    if (!id || !owner || !title || !body) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;
