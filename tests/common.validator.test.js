import { describe, test, expect } from 'vitest';
import { validateId, validateContent } from '../validators/common.validator.js';

describe('validateId', () => {
    test('Comprobar con ID válido', () => {
        expect(validateId(25, 'ID de autor inválido')).toEqual({
            valid: true,
            error: null
        });
    });

    test('Comprobar con ID mínimo permitido', () => {
        expect(validateId(1, 'ID de autor inválido')).toEqual({
            valid: true,
            error: null
        });
    });

    test('Comprobar con ID igual a cero', () => {
        expect(validateId(0, 'ID de autor inválido')).toEqual({
            valid: false,
            error: "ID de autor inválido"
        });
    });

    test('Comprobar con ID negativo', () => {
        expect(validateId(-5, 'ID de autor inválido')).toEqual({
            valid: false,
            error: "ID de autor inválido"
        });
    });

    test('Comprobar con ID decimal', () => {
        expect(validateId(2.5, 'ID de autor inválido')).toEqual({
            valid: false,
            error: "ID de autor inválido"
        });
    });

    test('Comprobar con ID tipo incorrecto', () => {
        expect(validateId("25", 'ID de autor inválido')).toEqual({
            valid: false,
            error: "ID de autor inválido"
        });
    });

    test('Comprobar con ID no numérico', () => {
        expect(validateId(NaN, 'ID de autor inválido')).toEqual({
            valid: false,
            error: "ID de autor inválido"
        });
    });

    test('Comprobar con ID máximo permitido', () => {
        expect(validateId(2147483647, 'ID de autor inválido')).toEqual({
            valid: true,
            error: null
        });
    });

    test('Comprobar con ID superior al máximo', () => {
        expect(validateId(2147483648, 'ID de autor inválido')).toEqual({
            valid: false,
            error: "ID de autor inválido"
        });
    });

    test('Devuelve un mensaje de error personalizado', () => {
        expect(validateId(-10, 'ID de publicación inválido')).toEqual({
            valid: false,
            error: "ID de publicación inválido"
        })
    });
    
});

describe('validateContent', () => {
    test('Comprobar con contenido válido', () => {
        expect(validateContent('Contenido de mi publicación')).toEqual({
            valid: true,
            error: null
        });
    });

    test('Comprobar con contenido numérico', () => {
        expect(validateContent(123)).toEqual({
            valid: false,
            error: 'El contenido debe ser un texto no vacío'
        });
    });

    test('Comprobar con contenido vacío', () => {
        expect(validateContent('')).toEqual({
            valid: false,
            error: 'El contenido debe ser un texto no vacío'
        });
    });

    test('Comprobar con contenido de espacios', () => {
        expect(validateContent('   ')).toEqual({
            valid: false,
            error: 'El contenido debe ser un texto no vacío'
        });
    });

    test('Comprobar con contenido null', () => {
        expect(validateContent(null)).toEqual({
            valid: false,
            error: 'El contenido debe ser un texto no vacío'
        });
    });

    test('Comprobar con contenido undefined', () => {
        expect(validateContent(undefined)).toEqual({
            valid: false,
            error: 'El contenido debe ser un texto no vacío'
        });
    });
});


