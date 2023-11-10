const CommentsTableHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableHelper = require('../../../../tests/ThreadsTableTestHelper');
const UserTableHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');
const DeletedComment = require('../../../Domains/comments/entities/DeletedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UserTableHelper.cleanTable();
    await ThreadTableHelper.cleanTable();
    await CommentsTableHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyOwner and verifyAvailableComment function ', () => {
    // owner
    it('should throw AuthorizationError when userId not correctly', async () => {
      // Arrange
      await UserTableHelper.addUser({ username: 'dicoding2' });
      await ThreadTableHelper.addThread({ id: 'thread-111' });
      await CommentsTableHelper.addComment({ id: 'comment-123', threadId: 'thread-111' });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment({ commentId: 'comment-123', owner: 'user-111' })).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when userId correctly', async () => {
      // Arrange
      await UserTableHelper.addUser({ username: 'dicoding321' });
      await ThreadTableHelper.addThread({ id: 'thread-321' });
      await CommentsTableHelper.addComment({ threadId: 'thread-321' });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment({ commentId: 'comment-123', owner: 'user-123' })).resolves.not.toThrowError(AuthorizationError);
    });

    // comment
    it('should throw NotFoundError when userId not correctly', async () => {
      // Arrange
      await UserTableHelper.addUser({ username: 'dicoding2' });
      await ThreadTableHelper.addThread({ id: 'thread-111' });
      await CommentsTableHelper.addComment({ id: 'comment-123', threadId: 'thread-111' });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment({ commentId: 'comment-111', owner: 'user-123' })).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when userId correctly', async () => {
      // Arrange
      await UserTableHelper.addUser({ username: 'dicoding321' });
      await ThreadTableHelper.addThread({ id: 'thread-321' });
      await CommentsTableHelper.addComment({ threadId: 'thread-321' });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment({ commentId: 'comment-123', owner: 'user-123' })).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addComment function', () => {
    it('should perist register comment', async () => {
      // Arrange
      await UserTableHelper.addUser({});
      await ThreadTableHelper.addThread({});
      const addComment = new AddComment({
        owner: 'user-123',
        threadId: 'thread-123',
        content: 'abc',
      });
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comment = await CommentsTableHelper.findComment('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return registered comment correctly', async () => {
      // Arrange
      await UserTableHelper.addUser({ id: 'user-321', username: 'dicoding1' });
      await ThreadTableHelper.addThread({ id: 'thread-321', owner: 'user-321' });
      const addComment = new AddComment({
        owner: 'user-321',
        threadId: 'thread-321',
        content: 'abc',
      });
      const fakeIdGenerator = () => '321'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-321',
        owner: addComment.owner,
        threadId: addComment.threadId,
        content: addComment.content,
        date: addedComment.date,
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should perist delete comment', async () => {
      // Arrange
      await UserTableHelper.addUser({});
      await ThreadTableHelper.addThread({});
      await CommentsTableHelper.addComment({});
      await new DeleteComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.deleteComment({ commentId: 'comment-123' });

      // Assert
      const comment = await CommentsTableHelper.findComment('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return deleted comment correctly', async () => {
      // Arrange
      await UserTableHelper.addUser({ id: 'user-321', username: 'dicoding1' });
      await ThreadTableHelper.addThread({ id: 'thread-321', owner: 'user-321' });
      await CommentsTableHelper.addComment({
        id: 'comment-123', threadId: 'thread-321', content: 'abc', owner: 'user-321',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const deletedComment = await commentRepositoryPostgres.deleteComment({ commentId: 'comment-123' });
      const getComment = await commentRepositoryPostgres.getComment({ id: 'thread-321' });

      // console.log(getComment[0].content);

      // Assert
      expect(deletedComment).toStrictEqual(new DeletedComment({ commentId: 'comment-123' }));
      expect(getComment[0].content).toStrictEqual('**komentar telah dihapus**');
    });
  });

  describe('getComment function', () => {
    it('should perist get comment', async () => {
      // Arrange
      await UserTableHelper.addUser({});
      await ThreadTableHelper.addThread({});
      await CommentsTableHelper.addComment({});

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const getComment = await commentRepositoryPostgres.getComment({ id: 'thread-123' });

      // Assert
      expect(getComment[0]).toStrictEqual({
        id: 'comment-123',
        username: 'dicoding',
        date: '22-22-22',
        content: 'abc',
      });
    });

    it('should return get comment correctly', async () => {
      // Arrange
      await UserTableHelper.addUser({ id: 'user-321', username: 'dicoding1' });
      await ThreadTableHelper.addThread({ id: 'thread-321', owner: 'user-321' });
      await CommentsTableHelper.addComment({
        id: 'comment-123', threadId: 'thread-321', content: 'abc', owner: 'user-321',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const getComment = await commentRepositoryPostgres.getComment({ id: 'thread-321' });

      // Assert
      expect(getComment[0]).toStrictEqual({
        id: 'comment-123',
        username: 'dicoding1',
        date: '22-22-22',
        content: 'abc',
      });
    });
  });
});
