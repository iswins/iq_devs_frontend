
class HttpError {

    constructor(message, code) {
        this.message = message;
        this.code = code;
    }

    getMessage() {
        return this.message;
    }

    getCode() {
        return this.code;
    }
}

export default HttpError;
