import express from 'express';

const createCommentRouter = (handler) => {
    const router = express.Router({ mergeParams: true });

    router.post('/', handler.postCommentHandler);
    return router;
}

export default createCommentRouter;