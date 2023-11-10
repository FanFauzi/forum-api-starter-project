const DeletedComment = require('../DeletedComment');

describe('a DeletedComment entities', () => {
  it('should throw error when comment payload did contain property', () => {
    // Arrange
    const requestPayload = {};

    // Action and Assert
    expect(() => new DeletedComment(requestPayload)).toThrowError('DELETED_COMMENT.NOT_NEEDED_PROPERTY');
  });

  it('should create DeletedComment object correctly', () => {
    // Arrange
    const requestPayload = { commentId: 'comment-123' };

    // Action
    const { commentId } = new DeletedComment(requestPayload);

    // Assert
    expect(commentId).toEqual(requestPayload.commentId);
  });
});
