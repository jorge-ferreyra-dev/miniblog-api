function validateEmail(email) {

    if (typeof email !== 'string' || email.trim() === '') {
        return {
            valid: false,
            error: "El email debe ser un texto no vacio"
        }
    }

    if(email.length > 150) {
        return {
            valid: false,
            error: "El email no puede superar los 150 caracteres"
        }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
            return {
                valid: false,
                error: 'El formato del email es inválido'
            }
    }

    return {
        valid: true,
        error: null
    }
}

module.exports = { validateEmail };