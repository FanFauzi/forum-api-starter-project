const GetComment = require('../GetComment');

describe('a GetComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user123',
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet type specification', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'thread-123',
      content: true,
      date: '22-22-22',
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetComment object correctly content deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user123',
      content: 'abc',
      date: '22-22-22',
      is_delete: true,
    };

    // Action
    const {
      id, username, content, date,
    } = new GetComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**komentar telah dihapus**');
  });

  it('should create GetComment object correctly content not deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user123',
      content: 'abc',
      date: '22-22-22',
      is_delete: false,
    };

    // Action
    const {
      id, username, content, date,
    } = new GetComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
