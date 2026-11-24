import { describe, test, expect } from 'vitest';
import { validateEmail } from '../validators/authors.validator.js';

describe('validateEmail', () => {

    test('Comprobar si el email es válido', () => {
        expect(validateEmail('ana@example.com')).toEqual({
            valid: true,
            error: null
        });
    });

    test('Probar con un tipo de dato incorrecto', () => {
        expect(validateEmail(123456)).toEqual({
            valid: false,
            error: "El email debe ser un texto no vacio"
        });
    });

    test('Comprobar con email vacio', () => {
        expect(validateEmail("")).toEqual({
            valid: false,
            error: "El email debe ser un texto no vacio"
        });
    });

    test('Email compuesto únicamente por espacios', () => {
        expect(validateEmail("     ")).toEqual({
            valid: false,
            error: "El email debe ser un texto no vacio"
        });
    });

    test('Email superior a 150 caracteres', () => {
        const emailInvalido = 'a'.repeat(139) + '@example.com';
        expect(validateEmail(emailInvalido)).toEqual({
            valid: false,
            error: "El email no puede superar los 150 caracteres"
        });
    });

    test('Comprobar con formato incorrecto', () => {
        expect(validateEmail("anaexample.com")).toEqual({
            valid: false,
            error: 'El formato del email es inválido'
        });
    });

    test('Email con espacios en los extremos', () => {
        expect(validateEmail(" anaexample@example.com ")).toEqual({
            valid: false,
            error: "El formato del email es inválido"
        });
    });

    test('Email de exactamente 150 caracteres', () => {
        const emailValido = 'a'.repeat(138) + '@example.com';
        expect(validateEmail(emailValido)).toEqual({
            valid: true,
            error: null
        });
    });

});



