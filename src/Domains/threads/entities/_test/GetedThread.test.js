const GetedThread = require('../GetedThread');

describe('a GetedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'abc',
      body: 'bca',
      date: '22022',
    };

    // Action and Assert
    expect(() => new GetedThread(payload)).toThrowError('GETED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: true,
      body: 'bca',
      date: '22022',
      username: 'fan',
    };

    // Action and Assert
    expect(() => new GetedThread(payload)).toThrowError('GETED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'abc',
      body: 'bca',
      date: '22022',
      username: 'fan',
    };

    // Action
    const getedThread = new GetedThread(payload);

    // Assert
    expect(getedThread.id).toEqual(payload.id);
    expect(getedThread.title).toEqual(payload.title);
    expect(getedThread.body).toEqual(payload.body);
    expect(getedThread.date).toEqual(payload.date);
    expect(getedThread.username).toEqual(payload.username);
  });
});
