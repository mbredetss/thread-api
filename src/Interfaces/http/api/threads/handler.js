import AddThreadUseCase from "../../../../Applications/use_case/AddThreadUseCase.js";

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
    }

    async postThreadHandler(req, res, next) {
        const accessToken = this._acessToken(req).split('Bearer ')[1];
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const addedThread = await addThreadUseCase.execute({ ...req.body, accessToken });
        
        res.status(201).json({
            status: 'success',
            data: {
                addedThread,
            },
        });
    }

    _acessToken(req) {
        return req.headers.authorization;
    }
}

export default ThreadsHandler;