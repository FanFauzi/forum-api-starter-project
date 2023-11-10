const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentHandler {
  constructor(container) {
    this.container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this.container.getInstance(AddCommentUseCase.name);

    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;

    const addedComment = await addCommentUseCase.execute({ threadId, owner, ...request.payload });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this.container.getInstance(DeleteCommentUseCase.name);

    const { id: owner } = request.auth.credentials;
    const { threadId, commentId: id } = request.params;

    // console.log(request.params);

    // console.log(id);

    await deleteCommentUseCase.execute({
      id,
      owner,
      threadId,
    });

    const response = h.response({
      status: 'success',
      message: 'comment terhapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentHandler;
