import { describe, test, expect } from 'vitest';
import { validateEmail, validateName, validateBio, validateRequiredFields } from '../validators/authors.validator.js';

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

describe('validateName', () => {

    test('Comprobar con nombre válido', () => {
        expect(validateName("Ana García")).toEqual({
            valid: true,
            error: null
        });
    });

    test('Tipo de dato incorrecto', () => {
        expect(validateName(1234)).toEqual({
            valid: false,
            error: "El nombre debe ser un texto no vacio"
        });
    });

    test('Nombre vacío', () => {
        expect(validateName("")).toEqual({
            valid: false,
            error: "El nombre debe ser un texto no vacio"
        });
    });

    test('Nombre compuesto únicamente por espacios', () => {
        expect(validateName("   ")).toEqual({
            valid: false,
            error: "El nombre debe ser un texto no vacio"
        });
    });

    test('Nombre superior a 100 caracteres', () => {
        const nombreInvalido = 'a'.repeat(101);
        expect(validateName(nombreInvalido)).toEqual({
            valid: false,
            error: "El nombre no puede superar los 100 caracteres"
        });
    });

    test('Nombre de exactamente 100 caracteres', () => {
        const nombreValido = 'a'.repeat(100);
        expect(validateName(nombreValido)).toEqual({
            valid: true,
            error: null
        })
    });

});

describe('validateBio', () => {

    test('Biografía válida', () => {
        expect(validateBio("Autor argentino")).toEqual({
            valid: true,
            error: null
        });
    });

    test('Biografía vacía', () => {
        expect(validateBio("")).toEqual({
            valid: true,
            error: null
        });
    });

    test('Solo espacios', () => {
        expect(validateBio("   ")).toEqual({
            valid: true,
            error: null
        });
    });

    test('Biografía nula', () => {
        expect(validateBio(null)).toEqual({
            valid: true,
            error: null
        });
    });

    test('Biografía no definida', () => {
        expect(validateBio(undefined)).toEqual({
            valid: true,
            error: null
        });
    });

    test('Tipo numérico', () => {
        expect(validateBio(1234)).toEqual({
            valid: false,
            error: 'La biografia debe contener texto'
        });
    });

    test('Tipo booleano', () => {
        expect(validateBio(true)).toEqual({
            valid: false,
            error: 'La biografia debe contener texto'
        });
    });

    test('Tipo objeto', () => {
        expect(validateBio({bio: "Autor Argentino"})).toEqual({
            valid: false,
            error: 'La biografia debe contener texto'
        });
    });
    
});

describe('validateRequiredFields', () => {
    test('Comprobar con ambos campos presentes', () => {
        expect(validateRequiredFields('Ana', 'ana@example.com')).toEqual({
            valid: true,
            error: null
        });
    });

    test('Comprobar con nombre undefined', () => {
        expect(validateRequiredFields(undefined, 'ana@example.com')).toEqual({
            valid: false,
            error: 'El nombre y el email son obligatorios'
        });
    });

    test('Comprobar con email undefined', () => {
        expect(validateRequiredFields('Ana', undefined)).toEqual({
            valid: false,
            error: 'El nombre y el email son obligatorios'
        });
    });

    test('Comprobar con ambos campos undefined', () => {
        expect(validateRequiredFields(undefined, undefined)).toEqual({
            valid: false,
            error: 'El nombre y el email son obligatorios'
        });
    });

    test('Comprobar con nombre vacío', () => {
        expect(validateRequiredFields('', 'ana@example.com')).toEqual({
            valid: false,
            error: 'El nombre y el email son obligatorios'
        });
    });

    test('Comprobar con email vacío', () => {
        expect(validateRequiredFields('Ana', '')).toEqual({
            valid: false,
            error: 'El nombre y el email son obligatorios'
        });
    });

    test('Comprobar con nombre null', () => {
        expect(validateRequiredFields(null, 'ana@example.com')).toEqual({
            valid: false,
            error: 'El nombre y el email son obligatorios'
        });
    });

    test('Comprobar con email null', () => {
        expect(validateRequiredFields('Ana', null)).toEqual({
            valid: false,
            error: 'El nombre y el email son obligatorios'
        });
    });
});