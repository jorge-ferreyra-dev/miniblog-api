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

function validateContent(content) {
    if (typeof content !== 'string' || content.trim() === '') {
        return {
            valid: false,
            error: 'El contenido debe ser un texto no vacío'
        };
    }

    return {
        valid: true,
        error: null
    };
}

module.exports = { validateId, validateContent };