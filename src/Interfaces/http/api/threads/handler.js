import AddThreadUseCase from "../../../../Applications/use_case/AddThreadUseCase.js";
import AuthenticationError from "../../../../Commons/exceptions/AuthenticationError.js";

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
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

    _accessToken(req) {
        const token = req.headers.authorization;
        if (token && token.indexOf('Bearer ') !== -1) {
            return token.split('Bearer ')[1];
        }
        throw new AuthenticationError('access token tidak valid!');
    }
}

export default ThreadsHandler;