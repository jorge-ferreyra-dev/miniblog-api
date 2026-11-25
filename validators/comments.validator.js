function validateRequiredFields(post_id, author_id, content) {

    if (post_id == null || author_id == null || content == null) {
        return {
            valid: false,
            error: "El ID del post, el ID del autor y el contenido son obligatorios"
        };
    }

    return {
        valid: true,
        error: null
    };
}

module.exports = { validateRequiredFields };