function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'El cuerpo de la solicitud contiene un JSON inválido'
        });
    }

    res.status(500).json({
        error: 'Error interno del servidor'
    });
}

module.exports = { errorHandler };