// const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');
const DeletedComment = require('../../../Domains/comments/entities/DeletedComment');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const mockDeleteComment = new DeletedComment({ commentId: 'comment-123' });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.threadId));
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.id, useCasePayload.owner));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDeleteComment));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const deleteComment = await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith({ id: 'thread-123' });
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith({
      commentId: useCasePayload.id,
      owner: useCasePayload.owner,
    });
    expect(deleteComment).toStrictEqual(new DeletedComment({ commentId: 'comment-123' }));
  });
});
