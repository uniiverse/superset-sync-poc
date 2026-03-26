export function logAxiosError(logger, message, error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx.
        logger.error("\n    ".concat(message, "\n    RESPONSE: ").concat(JSON.stringify(error.response.data), "\n    ERROR: ").concat(JSON.stringify(error.toJSON()), "\n    "));
    } else if (error.request) {
        // The request was made but no response was received `error.request`
        // is an instance of XMLHttpRequest in the browser and an instance
        // of http.ClientRequest in node.js.
        logger.error("\n    NO RESPONSE: ".concat(message, "\n    ERROR: ").concat(JSON.stringify(error.toJSON()), "\n    "));
    } else {
        // Something happened in setting up the request that triggered an Error.
        logger.error("\n    ".concat(message, "\n    ERROR: ").concat(error.message, "\n    "));
    }
}
