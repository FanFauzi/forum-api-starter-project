/* eslint-disable camelcase */
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const GetedThread = require('../../Domains/threads/entities/GetedThread');
// const GetCommnet = require('../../Domains/comments/entities/GetComment');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { owner, title, body } = addThread;
    const id = `thread-${this.idGenerator()}`;
    const time = new Date();
    const date = time.toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, owner, title, body, date',
      values: [id, title, body, date, owner],
    };

    const result = await this.pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThread(threadId) {
    const { id } = threadId;

    const queryThread = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
      FROM threads
      INNER JOIN users ON threads.owner = users.id
      WHERE threads.id = $1`,
      values: [id],
    };

    const resultThread = await this.pool.query(queryThread);
    await new GetedThread({ ...resultThread.rows[0] });
    return { ...resultThread.rows[0] };
  }

  async verifyAvailableThread(threadId) {
    const { id } = threadId;
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
