const DeleteComment = require('../DeleteComment');

describe('a DeleteComment entities', () => {
  it('should throw error when comment payload did not contain needed property', () => {
    // Arrange
    const requestPayload = {};

    // Action and Assert
    expect(() => new DeleteComment(requestPayload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should create DeleteComment object correctly', () => {
    // Arrange
    const requestPayload = {
      id: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // Action
    const { id, owner, threadId } = new DeleteComment(requestPayload);

    // Assert
    expect(id).toEqual(requestPayload.id);
    expect(owner).toEqual(requestPayload.owner);
    expect(threadId).toEqual(requestPayload.threadId);
  });
});
