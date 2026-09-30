# Reglas de negocio (dominio)

## Actores

- **Público** (sin sesión): consulta el catálogo.
- **Socio** (`SOCIO`): gestiona su perfil, sus préstamos (renovar) y sus reservas.
- **Bibliotecario** (`ADMIN`): gestiona catálogo, socios, préstamos, devoluciones y reservas.

## Catálogo

- **Categoría**: nombre único (sin distinguir mayúsculas), máximo 50 caracteres.
- **Autor**: nombre completo (obligatorio), nacionalidad y año de nacimiento (opcionales).
- **Libro**:
  - ISBN-13 válido (con dígito de control) y único; título; año de publicación; editorial; sinopsis.
  - Al menos un autor. Cero o más categorías.
  - No se puede borrar un autor ni una categoría que tengan libros asociados.
- **Ejemplar**: copia física de un libro, con código único autogenerado (p. ej. `BIB-000123`).
  - Estados: `DISPONIBLE`, `PRESTADO`, `APARTADO`, `EN_REPARACION`, `BAJA`.
  - Cambios manuales permitidos: `DISPONIBLE ↔ EN_REPARACION`, y de `DISPONIBLE` o `EN_REPARACION` a `BAJA`.
  - `PRESTADO` y `APARTADO` solo los cambian los préstamos y las reservas.

## Usuarios

- Email único; contraseña de al menos 8 caracteres con al menos una letra y un número; nombre y apellidos; teléfono opcional.
- Número de socio autogenerado.
- Estados: `ACTIVO` y `BLOQUEADO` (bloqueo manual del bibliotecario, con motivo). Un usuario bloqueado no puede iniciar sesión.

## Parámetros configurables (valores por defecto)

| Parámetro | Valor |
|---|---|
| Máximo de préstamos activos por socio | 3 |
| Duración de un préstamo | 14 días |
| Máximo de renovaciones por préstamo | 1 (añade 14 días) |
| Días de sanción por cada día de retraso | 2 |
| Máximo de reservas activas por socio | 2 |
| Días para recoger una reserva lista | 2 |

## Préstamos

- Solo los crea el bibliotecario, sobre un ejemplar concreto y un socio.
- **Condiciones para prestar:**
  - socio `ACTIVO`;
  - sin sanción vigente;
  - por debajo del máximo de préstamos activos;
  - ejemplar `DISPONIBLE`, o `APARTADO` precisamente para ese socio.
- **Al prestar:** vencimiento = hoy + duración; el ejemplar pasa a `PRESTADO`.
- **Renovación** (la hace el socio). Requiere:
  - que no se haya superado el máximo de renovaciones;
  - que el préstamo no esté vencido;
  - que el socio no tenga sanción;
  - que no haya reservas pendientes de ese libro.

  La nueva fecha es el vencimiento actual + duración.
- **Devolución:**
  - Se registra la fecha de devolución.
  - Si hay retraso, se crea una sanción de `días de retraso × días por día de retraso`. Empieza hoy o, si ya había una vigente, al final de esa.
  - El ejemplar vuelve a `DISPONIBLE`, o pasa a `APARTADO` si hay reservas pendientes del libro.

## Reservas

- Solo se puede reservar un libro si no tiene ningún ejemplar `DISPONIBLE`.
- El socio:
  - no puede tener sanción;
  - no puede superar el máximo de reservas activas;
  - no puede reservar un libro que ya tiene prestado ni reservar dos veces el mismo.
- Cola por orden de llegada (FIFO).
- Estados: `PENDIENTE`, `LISTA_PARA_RECOGER`, `COMPLETADA`, `CANCELADA`, `CADUCADA`.
- **Al devolver** un ejemplar de un libro con reservas pendientes:
  - el ejemplar pasa a `APARTADO`;
  - la primera reserva pasa a `LISTA_PARA_RECOGER`, con fecha límite = hoy + días para recoger.
- **Al prestar** un ejemplar apartado a su reservante, la reserva pasa a `COMPLETADA`.
- **Si no se recoge a tiempo**, la reserva pasa a `CADUCADA` y el ejemplar pasa al siguiente de la cola (o queda `DISPONIBLE` si no hay más).
- El socio puede cancelar sus reservas `PENDIENTE` o `LISTA_PARA_RECOGER`. Si cancela una lista para recoger, el ejemplar pasa al siguiente de la cola.
