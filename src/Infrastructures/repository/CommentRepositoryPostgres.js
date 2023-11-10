const AddedComment = require('../../Domains/comments/entities/AddedComment');
const GetComment = require('../../Domains/comments/entities/GetComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const DeletedComment = require('../../Domains/comments/entities/DeletedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async verifyAvailableComment({ commentId, owner }) {
    const query = {
      text: 'SELECT id, owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resouce ini');
    }
  }

  async addComment(addThread) {
    const { owner, content, threadId } = addThread;
    const id = `comment-${this.idGenerator()}`;
    const time = new Date();
    const date = time.toISOString();
    const isDelete = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, owner, thread_id, date, content, is_delete',
      values: [id, threadId, owner, date, content, isDelete],
    };

    const result = await this.pool.query(query);

    return new AddedComment({
      id: result.rows[0].id,
      owner: result.rows[0].owner,
      threadId: result.rows[0].thread_id,
      date: result.rows[0].date,
      content: result.rows[0].content,
    });
  }

  async deleteComment(deleteComment) {
    const { commentId } = deleteComment;
    // console.log(id)
    const isDelete = true;

    const updateQuery = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2 RETURNING id',
      values: [isDelete, commentId],
    };

    await this.pool.query(updateQuery);
    return new DeletedComment({ commentId });
  }

  async getComment(getComment) {
    const { id: threadId } = getComment;

    const queryComment = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete FROM threads
      INNER JOIN comments ON comments.thread_id = threads.id
      INNER JOIN users ON users.id = comments.owner
      WHERE threads.id = $1`,
      values: [threadId],
    };

    const resultComment = await this.pool.query(queryComment);
    const comment = resultComment.rows;
    // console.log(comment);
    const commentResult = comment.map((commnet) => {
      const {
        id, username, content, date,
      } = new GetComment(commnet);
      return {
        id, username, content, date,
      };
    });
    return commentResult;
  }
}

module.exports = CommentRepositoryPostgres;
