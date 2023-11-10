const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: 'bca',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet type specification', () => {
    // Arrange
    const payload = {
      owner: 222,
      title: 123,
      body: true,
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title contains more than 50 character', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      title: 'abcabcbabcabbabcbabcabbbacbabacabcabcbabcabbabcbabcabbbacbabacabcabcbabcabbabcbabcabbbacbabacabcabcbabcabbabcbabcabbbacbabacabcabcbabcabbabcbabcabbbacbabacabcabcbabcabbabcbabcabbbacbabacabcabcbabcabbabcbabcabbbacbabacabcabcbabcabbabcbabcabbbacbabacabcabcbabcabbabcbabcabbbacbabac',
      body: 'abc',
    };
    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      title: 'abc',
      body: 'bca',
    };

    // Action
    const { owner, title, body } = new AddThread(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
