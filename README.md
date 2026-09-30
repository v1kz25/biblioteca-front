# biblioteca-front

Aplicación web de gestión de una biblioteca: catálogo público, área de socio (préstamos, reservas y perfil) y área de administración para el bibliotecario. Es un proyecto de práctica para aprender **Angular 19**. Consume la API de [biblioteca-back](https://github.com/v1kz25/biblioteca-back).

Las reglas del dominio están en [`docs/reglas-negocio.md`](docs/reglas-negocio.md).

## Requisitos

- Node 22 LTS (hay un `.nvmrc`: `nvm use`)
- Google Chrome o Chromium, para los tests
- [biblioteca-back](https://github.com/v1kz25/biblioteca-back) en marcha en `http://localhost:8080`

## Cómo arrancar

```bash
npm install
npm start          # ng serve en http://localhost:4200
```

Necesita el back en marcha. En desarrollo, `proxy.conf.json` redirige las peticiones a `/api` hacia `http://localhost:8080`, así que no hace falta configurar CORS. La URL base de la API (`/api/v1`) está en `src/environments/`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Build de producción en `dist/` |
| `npm test` | Tests con Karma en modo watch |
| `npx ng test --watch=false --browsers=ChromeHeadless` | Tests una sola vez, sin ventana (igual que en la CI) |
| `npm run lint` | ESLint (angular-eslint + orden de miembros con `perfectionist/sort-classes`) |

Con Chromium en lugar de Chrome, exporta antes `CHROME_BIN` con la ruta del ejecutable.

## Estructura de carpetas

_Pendiente: se decide y documenta en la issue F-01._

## Flujo de trabajo

- `develop` es la rama de integración; `main` solo tiene versiones publicadas (`vX.Y.Z`).
- Una rama por issue (`feature/F-04-catalogo`), que sale de `develop` y vuelve a `develop` por PR con `Closes #n`.
- Cada issue se cierra igual: **código → revisión pre-merge → tests unitarios en verde → PR → merge**.

## Orden de trabajo recomendado

Alterna back y front por milestone para ver resultados pronto.

1. B-01 → F-01 → F-02
2. **M1:** B-02 → B-03 → B-04 → F-03 → B-05 → F-06 → B-06 → F-07 → B-07 → F-08 → B-08 → B-09 → F-04 → F-05
3. **M2:** B-10 → B-11 → F-09 → B-12 → F-10 → B-13 → F-11 → B-14 → F-12 → B-15 → F-13
4. **M3:** B-16 → B-17 → F-14 → B-18 → F-15 → B-19 → B-20 → F-16 → F-17
5. **M4:** B-21 → B-22 → F-18 → B-23 → F-19
6. **M5:** B-24 → B-25 → B-26 → F-20 → F-21
7. **M6:** a elegir
