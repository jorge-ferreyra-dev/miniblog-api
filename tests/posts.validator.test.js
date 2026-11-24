import { describe, test, expect } from 'vitest';
import { validateRequiredFields, validateTitle, validateContent, validatePublished } from '../validators/posts.validator.js';

describe('validateRequiredFields', () => {
    test('Comprobar con todos los campos presentes', () => {
        expect(validateRequiredFields(1, 'Título', 'Contenido')).toEqual({
            valid: true,
            error: null
        });
    });

    test('Comprobar con autor undefined', () => {
        expect(validateRequiredFields(undefined, 'Título', 'Contenido')).toEqual({
            valid: false,
            error: 'Los campos autor, título y contenido son obligatorios'
        });
    });

    test('Comprobar con título undefined', () => {
        expect(validateRequiredFields(1, undefined, 'Contenido')).toEqual({
            valid: false,
            error: 'Los campos autor, título y contenido son obligatorios'
        });
    });

    test('Comprobar con contenido undefined', () => {
        expect(validateRequiredFields(1, 'Título', undefined)).toEqual({
            valid: false,
            error: 'Los campos autor, título y contenido son obligatorios'
        });
    });

    test('Comprobar con autor null', () => {
        expect(validateRequiredFields(null, 'Título', 'Contenido')).toEqual({
            valid: false,
            error: 'Los campos autor, título y contenido son obligatorios'
        });
    });

    test('Comprobar con título null', () => {
        expect(validateRequiredFields(1, null, 'Contenido')).toEqual({
            valid: false,
            error: 'Los campos autor, título y contenido son obligatorios'
        });
    });

    test('Comprobar con contenido null', () => {
        expect(validateRequiredFields(1, 'Título', null)).toEqual({
            valid: false,
            error: 'Los campos autor, título y contenido son obligatorios'
        });
    });

    test('Comprobar con todos los campos undefined', () => {
        expect(validateRequiredFields(undefined, undefined, undefined)).toEqual({
            valid: false,
            error: 'Los campos autor, título y contenido son obligatorios'
        });
    });
});

describe('validateTitle', () => {
    test('Comprobar con título válido', () => {
        expect(validateTitle('Mi primera publicación')).toEqual({
            valid: true,
            error: null
        });
    });

    test('Comprobar con título numérico', () => {
        expect(validateTitle(123)).toEqual({
            valid: false,
            error: 'El título debe ser un texto no vacío'
        });
    });

    test('Comprobar con título vacío', () => {
        expect(validateTitle('')).toEqual({
            valid: false,
            error: 'El título debe ser un texto no vacío'
        });
    });

    test('Comprobar con título de espacios', () => {
        expect(validateTitle('   ')).toEqual({
            valid: false,
            error: 'El título debe ser un texto no vacío'
        });
    });

    test('Comprobar con título de 200 caracteres', () => {
        expect(validateTitle('a'.repeat(200))).toEqual({
            valid: true,
            error: null
        });
    });

    test('Comprobar con título superior a 200 caracteres', () => {
        expect(validateTitle('a'.repeat(201))).toEqual({
            valid: false,
            error: 'El título no puede superar los 200 caracteres'
        });
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

describe('validatePublished', () => {
    test('Comprobar con published true', () => {
        expect(validatePublished(true)).toEqual({
            valid: true,
            error: null
        });
    });

    test('Comprobar con published false', () => {
        expect(validatePublished(false)).toEqual({
            valid: true,
            error: null
        });
    });

    test('Comprobar con published undefined', () => {
        expect(validatePublished(undefined)).toEqual({
            valid: true,
            error: null
        });
    });

    test('Comprobar con published null', () => {
        expect(validatePublished(null)).toEqual({
            valid: false,
            error: 'El estado de post debe ser un booleano'
        });
    });

    test('Comprobar con published de tipo string', () => {
        expect(validatePublished('true')).toEqual({
            valid: false,
            error: 'El estado de post debe ser un booleano'
        });
    });

    test('Comprobar con published numérico', () => {
        expect(validatePublished(1)).toEqual({
            valid: false,
            error: 'El estado de post debe ser un booleano'
        });
    });

    test('Comprobar con published de tipo objeto', () => {
        expect(validatePublished({})).toEqual({
            valid: false,
            error: 'El estado de post debe ser un booleano'
        });
    });
});
