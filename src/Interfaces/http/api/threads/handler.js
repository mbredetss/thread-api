import AddThreadUseCase from "../../../../Applications/use_case/AddThreadUseCase.js";
import GetDetailThreadUseCase from "../../../../Applications/use_case/GetDetailThreadUseCase.js";
import AuthenticationError from "../../../../Commons/exceptions/AuthenticationError.js";

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
    }

    async postThreadHandler(req, res) {
        const accessToken = this._accessToken(req);
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const addedThread = await addThreadUseCase.execute({ ...req.body, accessToken });
        
        res.status(201).json({
            status: 'success',
            data: {
                addedThread,
            },
        });
    }

    async getDetailThreadHandler(req, res) {
        const threadId = req.params.threadId;
        const getDetailTreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
        const detailThread = await getDetailTreadUseCase.execute({threadId});

        res.status(201).json({
            status: 'success', 
            data: detailThread, 
        });
    }

    _accessToken(req) {
        const token = req.headers.authorization;
        if (token && token.indexOf('Bearer ') !== -1) {
            return token.split('Bearer ')[1];
        }
        throw new AuthenticationError('access token tidak valid!');
    }
}

export default ThreadsHandler;