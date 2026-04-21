import NewThread from "../../Domains/threads/entities/NewThread";

class AddThreadUseCase {
    constructor({
        threadRepository, 
        authenticationTokenManager,
    }) {
        this._threadRepository = threadRepository;
        this._authenticationTokenManager = authenticationTokenManager
    }
    async execute(useCasePayload) {
        this._verifyPayload(useCasePayload);

        const { accessToken, title, body } = useCasePayload;
        await this._authenticationTokenManager.verifyAccessToken(accessToken);     
        const { id } = await this._authenticationTokenManager.decodePayload(accessToken);
        const owner = id;
        return await this._threadRepository.addThread(new NewThread({
            title, 
            body, 
            owner,
        }));
    }

    _verifyPayload(payload) {
        const { accessToken } = payload;

        if (!accessToken) {
            throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
        }

        if (typeof accessToken !== 'string') {
            throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

export default AddThreadUseCase;