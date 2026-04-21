import express from 'express';
import AuthenticationTokenManager from '../../../../Applications/security/AuthenticationTokenManager';
import InvariantError from '../../../../Commons/exceptions/InvariantError';

const createThreadsRouter = (handler, container) => {
  const router = express.Router();

  router.post('/', handler.postThreadHandler);
  return router;
};

export default createThreadsRouter;
