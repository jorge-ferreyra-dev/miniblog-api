# Documentación del uso de inteligencia artificial

## Introducción

Durante el desarrollo de MiniBlog API utilicé ChatGPT como herramienta de consulta, aprendizaje y apoyo técnico.

El objetivo fue comprender los conceptos necesarios para desarrollar el proyecto, resolver dudas y revisar mis implementaciones, manteniendo la responsabilidad sobre el código y las decisiones técnicas.

A continuación, se presentan ejemplos de las interacciones realizadas con la IA, acompañados de capturas de pantalla como evidencia.

## Primer Promt: Definición del rol de la IA

**Objetivo:** establecer cómo utilizaría la inteligencia artificial durante el desarrollo del proyecto.

**Consulta realizada:** en el primer prompt expliqué que quería desarrollar MiniBlog por mi cuenta, escribir el código y tomar las decisiones técnicas. Solicité que la IA actuara como profesor y revisor, guiándome paso a paso sin entregar el proyecto resuelto.

**Respuesta de la IA:** ChatGPT propuso una metodología de trabajo basada en analizar la consigna, dividir el desarrollo en etapas, revisar mis implementaciones y comprender los errores antes de corregirlos.

**Resultado:** se estableció una forma de trabajo orientada al aprendizaje, en la que la IA funcionaría como apoyo y yo mantendría el control del desarrollo.

**Evidencia:**

![Primer prompt ](screenshot-IA/primer-promt/primer-promt.png)
![Respuesta 1](screenshot-IA/primer-promt/01-primer-promt.png)
![Respuesta 2](screenshot-IA/primer-promt/02-primer-promt.png)
![Respuesta 3](screenshot-IA/primer-promt/03-primer-promt.png)

##  Revisión del diseño de la base de datos

**Objetivo:** revisar la estructura de las tablas `authors` y `posts`, sus restricciones y la relación entre ambas.

**Consulta realizada:** compartí el código SQL que había desarrollado para crear las tablas e insertar datos de ejemplo, solicitando una revisión de su estructura.

**Respuesta de la IA:** ChatGPT confirmó que las claves primarias, la clave foránea y las restricciones eran coherentes con los requisitos. También recomendó separar la creación de tablas (`setup.sql`) de la inserción de datos de prueba (`seed.sql`).

**Decisiones tomadas:**

- Utilicé `SERIAL` para generar identificadores automáticamente, priorizando la simplicidad del proyecto. Aunque conozco la alternativa `GENERATED AS IDENTITY`, consideré que `SERIAL` era suficiente para esta implementación.
- Elegí `ON DELETE RESTRICT` para impedir la eliminación de autores que todavía tengan publicaciones asociadas, preservando la integridad referencial.
- Utilicé `UNIQUE` en el campo `email` y definí los campos obligatorios y límites de longitud.
- Separé los scripts `setup.sql` y `seed.sql` para mantener diferenciada la estructura de la base de datos de los datos de ejemplo.

**Resultado:** mantuve el diseño relacional propuesto y organicé los scripts SQL para facilitar la configuración de la base de datos.

**Evidencia:**

![Revisión del diseño de la base de datos](screenshot-IA/revision-db/revision-db.png)
![Respuesta 1](screenshot-IA/revision-db/01-revision-db.png)
![Respuesta 2](screenshot-IA/revision-db/02-revision-db.png)
![Respuesta 3](screenshot-IA/revision-db/03-revision-db.png)

##  Revisión del módulo de autores

**Objetivo:** revisar el código de `authors.js` para identificar errores, posibles problemas de seguridad y oportunidades de mejora.

**Consulta realizada:** compartí mi implementación del CRUD de autores y solicité una revisión técnica sobre su funcionamiento, rendimiento, legibilidad, seguridad y validaciones.

**Respuesta de la IA:** ChatGPT identificó aspectos positivos, como el uso de consultas SQL parametrizadas, las restricciones de PostgreSQL y los códigos HTTP. También señaló posibles errores y recomendó mejorar las validaciones, reutilizar funciones y separar responsabilidades.

**Decisión técnica:** prioricé una implementación sencilla y acorde con los requisitos del proyecto. Decidí mantener las consultas SQL dentro de los endpoints y evitar una refactorización arquitectónica que agregara complejidad innecesaria en esta etapa.

**Resultado:** a partir de la revisión, implementé las correcciones sugeridas para mejorar las validaciones y el manejo de errores, incluyendo la protección de `req.body`, la validación de los límites de caracteres y el manejo de JSON mal formado.

Decidí mantener una arquitectura sencilla, con las consultas SQL dentro de los endpoints, y dejar las refactorizaciones estructurales como posibles mejoras futuras.

**Evidencia:**

![Revisión del módulo de autores](screenshot-IA/revision-authors/revision-authors.png)
![Respuesta 1](screenshot-IA/revision-authors/01-revision-authors.png)
![Respuesta 2](screenshot-IA/revision-authors/02-revision-authors.png)
![Respuesta 3](screenshot-IA/revision-authors/03-revision-authors.png)
![Respuesta 4](screenshot-IA/revision-authors/04-revision-authors.png)
![Respuesta 5](screenshot-IA/revision-authors/05-revision-authors.png)
![Respuesta 6](screenshot-IA/revision-authors/06-revision-authors.png)
![Respuesta 7](screenshot-IA/revision-authors/07-revision-authors.png)
![Respuesta 8](screenshot-IA/revision-authors/08-revision-authors.png)

##  Revisión del módulo de publicaciones

**Objetivo:** revisar el funcionamiento, las validaciones, la seguridad y las buenas prácticas REST del archivo `posts.js`.

**Consulta realizada:** compartí mi implementación de los endpoints de publicaciones y solicité una revisión técnica para identificar errores, posibles vulnerabilidades y oportunidades de mejora.

**Respuesta de la IA:** ChatGPT detectó un código HTTP incorrecto en el endpoint `DELETE`, recomendó mejorar las validaciones de entrada y señaló oportunidades de refactorización. También explicó la diferencia entre el manejo local y centralizado de errores.

**Decisiones tomadas:**

- Corregí los errores y las validaciones señaladas durante la revisión.
- Mantuve el método `PUT` para realizar actualizaciones completas de las publicaciones, exigiendo los campos obligatorios.
- Decidí conservar las validaciones dentro de los endpoints para mantener una implementación sencilla.

**Resultado:** mejoré la consistencia de las respuestas HTTP y las validaciones del módulo, manteniendo una estructura acorde con los objetivos del proyecto.

**Evidencia:**

![Revisión del módulo de publicaciones](screenshot-IA/revision-posts/revision-posts.png)
![Respuesta 1](screenshot-IA/revision-posts/01-respuesta-posts.png)
![Respuesta 2](screenshot-IA/revision-posts/02-respuesta-posts.png)
![Respuesta 3](screenshot-IA/revision-posts/03-respuesta-posts.png)
![Respuesta 4](screenshot-IA/revision-posts/04-respuesta-posts.png)
![Respuesta 5](screenshot-IA/revision-posts/05-respuesta-posts.png)
![Respuesta 6](screenshot-IA/revision-posts/06-respuesta-posts.png)
![Respuesta 7](screenshot-IA/revision-posts/07-respuesta-posts.png)
![Respuesta 8](screenshot-IA/revision-posts/08-respuesta-posts.png)
![Respuesta 9](screenshot-IA/revision-posts/09-respuesta-posts.png)
![Respuesta 10](screenshot-IA/revision-posts/10-respuesta-posts.png)
![Respuesta 11](screenshot-IA/revision-posts/11-respuesta-posts.png)
![Respuesta 12](screenshot-IA/revision-posts/12-respuesta-posts.png)
![Respuesta 13](screenshot-IA/revision-posts/13-respuesta-posts.png)
![Respuesta 14](screenshot-IA/revision-posts/14-respuesta-posts.png)
![Respuesta 15](screenshot-IA/revision-posts/15-respuesta-posts.png)
![Respuesta 16](screenshot-IA/revision-posts/16-respuesta-posts.png)

## Revisión de las pruebas automatizadas

**Objetivo:** evaluar la calidad y confiabilidad de las pruebas automatizadas desarrolladas con Vitest y Supertest.

**Consulta realizada:** compartí los archivos `app.test.js`, `authors.test.js` y `posts.test.js`, solicitando una revisión de los casos de prueba, las validaciones, las buenas prácticas y el manejo de los datos utilizados durante su ejecución.

**Respuesta de la IA:** ChatGPT confirmó que las pruebas cubrían los requisitos mínimos del proyecto, pero identificó oportunidades de mejora relacionadas con el uso de correos electrónicos fijos, la limpieza de registros temporales y la dependencia de datos existentes en PostgreSQL.

También recomendó verificar más propiedades de las respuestas HTTP y mejorar la organización de los bloques `try/finally` para garantizar la limpieza de los datos de prueba.

**Decisiones técnicas:**

- Utilicé Vitest como herramienta de ejecución de pruebas y Supertest para realizar solicitudes HTTP a la API.
- Elegí realizar pruebas de integración utilizando PostgreSQL, para comprobar el comportamiento real de los endpoints y su interacción con la base de datos.
- Consideré importante que las pruebas pudieran ejecutarse repetidamente sin depender de registros creados anteriormente.
- Mantuve una estructura de pruebas sencilla, sin incorporar herramientas adicionales que no fueran necesarias para cumplir la consigna.

**Resultado:** la revisión permitió identificar mejoras para aumentar la confiabilidad, independencia y repetibilidad de las pruebas automatizadas.

**Evidencia:**

![Revisión de las pruebas automatizadas](screenshot-IA/revision-tests/revision-tests.png)
![Respuesta 1](screenshot-IA/revision-tests/01-revision-tests.png)
![Respuesta 2](screenshot-IA/revision-tests/02-revision-tests.png)
![Respuesta 3](screenshot-IA/revision-tests/03-revision-tests.png)
![Respuesta 4](screenshot-IA/revision-tests/04-revision-tests.png)
![Respuesta 5](screenshot-IA/revision-tests/05-revision-tests.png)
![Respuesta 6](screenshot-IA/revision-tests/06-revision-tests.png)
![Respuesta 7](screenshot-IA/revision-tests/07-revision-tests.png)
![Respuesta 8](screenshot-IA/revision-tests/08-revision-tests.png)
![Respuesta 9](screenshot-IA/revision-tests/09-revision-tests.png)


