const { error } = require("node:console");

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
                error: "El formato del email es inválido"
            }
    }

    return {
        valid: true,
        error: null
    }
}

function validateName(name) {
    
    if(typeof name !== 'string' || name.trim() === '') {
        return {
            valid: false,
            error: "El nombre debe ser un texto no vacio"
        }
    }

    if(name.length > 100) {
        return {
            valid: false,
            error: "El nombre no puede superar los 100 caracteres"
        }
    }

    return {
        valid: true,
        error: null
    }
}

function validateBio(bio) {

    if(bio != null && typeof bio !== 'string') {
        return {
            valid: false,
            error: 'La biografia debe contener texto'
        };
    }

    return {
        valid: true,
        error: null
    };
}

function validateRequiredFields(name, email) {

    if(!name || !email) {
        return {
            valid: false,
            error: "El nombre y el email son obligatorios"
        };
    }

    return {
        valid: true,
        error: null
    };
}

module.exports = { validateEmail, validateName, validateBio, validateRequiredFields };