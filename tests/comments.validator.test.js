import { describe, test, expect } from "vitest";
import { validateRequiredFields } from "../validators/comments.validator";

describe('validateRequiredFields', () => {
    test('Todos los campos presentes', () => {
        expect(validateRequiredFields(1, 2, 'Contenido')).toEqual({
            valid: true,
            error: null
        });
    });

    test('post_id undefined', () => {
        expect(validateRequiredFields(undefined, 2, 'Contenido')).toEqual({
            valid: false,
            error: "El ID del post, el ID del autor y el contenido son obligatorios"
        });
    });

    test('author_id undefined', () => {
        expect(validateRequiredFields(1, undefined, 'Contenido')).toEqual({
            valid: false,
            error: "El ID del post, el ID del autor y el contenido son obligatorios"
        });
    });

    test('content undefined', () => {
        expect(validateRequiredFields(1, 2, undefined)).toEqual({
            valid: false,
            error: "El ID del post, el ID del autor y el contenido son obligatorios"
        });
    });

    test('post_id null', () => {
        expect(validateRequiredFields(null, 2, 'Contenido')).toEqual({
            valid: false,
            error: "El ID del post, el ID del autor y el contenido son obligatorios"
        });
    });

    test('author_id null', () => {
        expect(validateRequiredFields(1, null, 'Contenido')).toEqual({
            valid: false,
            error: "El ID del post, el ID del autor y el contenido son obligatorios"
        });
    });

    test('content null', () => {
        expect(validateRequiredFields(1, 2, null)).toEqual({
            valid: false,
            error: "El ID del post, el ID del autor y el contenido son obligatorios"
        });
    });

    test('Todos los campos undefined', () => {
        expect(validateRequiredFields(undefined, undefined, undefined)).toEqual({
            valid: false,
            error: "El ID del post, el ID del autor y el contenido son obligatorios"
        });
    });

    test('Acepta contenido vacío como campo presente', () => {
        expect(validateRequiredFields(1, 2, "")).toEqual({
            valid: true,
            error: null
        });
    });
});