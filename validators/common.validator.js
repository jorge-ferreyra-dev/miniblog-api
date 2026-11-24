function validateId(id, errorMessage) {

    if (!Number.isSafeInteger(id) || id <= 0 || id > 2147483647) {
        return { 
            valid: false,
            error: errorMessage 
        };
    }

    return {
        valid: true,
        error: null
    };

}

module.exports = { validateId };