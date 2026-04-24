import express from 'express';

const createThreadsRouter = (handler, container) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', handler.postThreadHandler);
  router.get('/', handler.getDetailThreadHandler);
  return router;
};

export default createThreadsRouter;
