const pool = require('../../database/postgres/pool');
const ThreadTableHelper = require('../../../../tests/ThreadsTableTestHelper');
const UserTableHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableHelper = require('../../../../tests/CommentsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const GetThread = require('../../../Domains/threads/entities/GetThread');
// const GetedThread = require('../../../Domains/threads/entities/GetedThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
// const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UserTableHelper.cleanTable();
    await ThreadTableHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when threadId not available', async () => {
      // Arrange
      await UserTableHelper.addUser({ username: 'dicoding2' });
      await ThreadTableHelper.addThread({ id: 'thread-111' });
      await CommentTableHelper.addComment({ id: 'comment-123', threadId: 'thread-111' });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when threadId available', async () => {
      // Arrange
      await UserTableHelper.addUser({ username: 'dicoding321' });
      await ThreadTableHelper.addThread({ id: 'thread-321' });
      await CommentTableHelper.addComment({ threadId: 'thread-321' });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread({ id: 'thread-321' })).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addThread function', () => {
    it('should perist register thread', async () => {
      // Arrange
      await UserTableHelper.addUser({ id: 'user-321', username: 'dicoding1' });
      const addThread = new AddThread({
        owner: 'user-321',
        title: 'abc',
        body: 'cba',
      });
      const fakeIdGenerator = () => '321'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const thread = await ThreadTableHelper.findThread('thread-321');
      expect(thread).toHaveLength(1);
    });

    it('should return registered thread correctly', async () => {
      // Arrange
      await UserTableHelper.addUser({});
      const addThread = new AddThread({
        owner: 'user-123',
        title: 'abc',
        body: 'cba',
      });
      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        owner: 'user-123',
        title: 'abc',
        body: 'cba',
        date: '22-22-22',
      }));
    });
  });

  describe('getThread function', () => {
    it('should perist get thread', async () => {
      // Arrange
      await UserTableHelper.addUser({ id: 'user-123', username: 'dicoding1' });
      await ThreadTableHelper.addThread({ id: 'thread-321', owner: 'user-123' });
      await CommentTableHelper.addComment({ threadId: 'thread-321', owner: 'user-123' });
      const getThread = new GetThread({
        id: 'thread-321',
      });

      const fakeIdGenerator = () => '321'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await threadRepositoryPostgres.verifyAvailableThread(getThread);
      const getedThread = await threadRepositoryPostgres.getThread(getThread);

      // console.log(getedThread);
      // Assert
      expect(getedThread).toStrictEqual({
        id: 'thread-321',
        username: 'dicoding1',
        title: 'abc',
        body: 'bca',
        date: '22-22-22',
      });
    });

    it('should thwrow error when threadId not available', async () => {
      // Arrange
      await UserTableHelper.addUser({ id: 'user-123', username: 'dicoding1' });
      await ThreadTableHelper.addThread({ id: 'thread-321', owner: 'user-123' });

      const fakeIdGenerator = () => '111'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-321')).rejects.toThrowError(NotFoundError);
    });
  });
});
