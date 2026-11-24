
function validateRequiredFields(author_id, title, content) {
    if (author_id == null || title == null || content == null) {
        return {
            valid: false,
            error: 'Los campos autor, título y contenido son obligatorios'
        };
    }

    return {
        valid: true,
        error: null
    };
}

function validateTitle(title) {
    if (typeof title !== 'string' || title.trim() === '') {
        return {
            valid: false,
            error: 'El título debe ser un texto no vacío'
        };
    }

    if (title.length > 200) {
        return {
            valid: false,
            error: 'El título no puede superar los 200 caracteres'
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

function validatePublished(published) {
    if (published !== undefined && typeof published !== 'boolean') {
        return {
            valid: false,
            error: 'El estado de post debe ser un booleano'
        };
    }

    return {
        valid: true,
        error: null
    };
}

module.exports = {
    validateRequiredFields,
    validateTitle,
    validateContent,
    validatePublished
};
