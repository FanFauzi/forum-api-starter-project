const GetThread = require('../../../Domains/threads/entities/GetThread');
const GetedThread = require('../../../Domains/threads/entities/GetedThread');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
      title: 'abc',
      body: 'bca',
      date: '22022',
      username: 'fan',
    };

    const mockGetedThread = new GetedThread({
      id: 'thread-123',
      title: 'abc',
      body: 'bca',
      date: '22022',
      username: 'fan',
    });

    const mockGetedComment = new GetComment({
      id: 'comment-123',
      username: 'fan',
      date: '22022',
      content: 'abc',
      is_delete: false,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetedThread));
    mockCommentRepository.getComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetedComment));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await getThreadUseCase.execute(useCasePayload);
    const result = await getThreadUseCase.execute(useCasePayload);
    // console.log(ge)

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith({ id: 'thread-123' });
    expect(mockThreadRepository.getThread).toBeCalledWith({ id: 'thread-123' });
    expect(mockCommentRepository.getComment).toBeCalledWith({ id: 'thread-123' });
    expect(mockThreadRepository.getThread).toBeCalledWith(new GetThread({
      id: 'thread-123',
      title: 'abc',
      body: 'bca',
      date: '22022',
      username: 'fan',
    }));

    const final1 = JSON.stringify(result);
    const final2 = JSON.stringify({
      id: useCasePayload.id,
      date: useCasePayload.date,
      title: useCasePayload.title,
      body: useCasePayload.body,
      username: useCasePayload.username,
      comments: {
        id: 'comment-123',
        username: 'fan',
        date: '22022',
        isDelete: false,
        content: 'abc',
      },
    });
    expect(final1).toStrictEqual(final2);
  });
});
