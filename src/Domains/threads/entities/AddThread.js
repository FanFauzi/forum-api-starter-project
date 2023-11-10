class AddThread {
  constructor(payload) {
    this.verifyPayload(payload);

    const { owner, title, body } = payload;

    this.owner = owner;
    this.title = title;
    this.body = body;
  }

  verifyPayload({ owner, title, body }) {
    if (!owner || !title || !body) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (title.length > 50) {
      throw new Error('ADD_THREAD.TITLE_LIMIT_CHAR');
    }
  }
}

module.exports = AddThread;
