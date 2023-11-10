const pool = require('../../database/postgres/pool');
const CommentsTableHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableHelper.cleanTable();
  });

  describe('when POST /commnets', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange

      const requestPayload = {
        content: 'abc',
      };

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding123',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding123',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'abc',
          body: 'bca',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: { addedThread: { id: threadId } } } = JSON.parse(thread.payload);

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when comment request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding321',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding321',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'abcd',
          body: 'bcad',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: { addedThread: { id } } } = JSON.parse(thread.payload);
      // console.log(id);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response comment 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = { content: true };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding321',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding321',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'abcd',
          body: 'bcad',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: { addedThread: { id } } } = JSON.parse(thread.payload);
      // console.log(id);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /commnets', () => {
    it('should response 201 and persisted delete comment', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding12345',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding12345',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'abc',
          body: 'bca',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: { addedThread: { id: threadId } } } = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'abc',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: { addedComment: { id: commentId } } } = JSON.parse(comment.payload);

      // console.log(threadId);

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      // console.log(responseJson.message);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when delete comment request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding12345',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding12345',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'abc',
          body: 'bca',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { data: { addedThread: { id: threadId } } } = JSON.parse(thread.payload);

      // console.log(threadId);

      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'abc',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const vailedCommentId = 'xxx';
      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${vailedCommentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });
  });
});
