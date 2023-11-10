const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
      content: 'abc',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
      date: '22-22-22',
      content: useCasePayload.content,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith({ id: 'thread-123' });
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
      date: '22-22-22',
      content: useCasePayload.content,
    }));
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
      content: useCasePayload.content,
    }));
  });
});
