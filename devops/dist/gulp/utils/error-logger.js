export var errorLogger = function (message, err, handleUrl) {
    return {
        message: message,
        handlerPath: handleUrl,
        errorMessage: err.message,
    };
};
export default errorLogger;
