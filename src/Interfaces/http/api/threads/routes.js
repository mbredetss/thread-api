import express from 'express';

const createThreadsRouter = (handler, container) => {
  const router = express.Router();

  router.post('/', handler.postThreadHandler);
  return router;
};

export default createThreadsRouter;
