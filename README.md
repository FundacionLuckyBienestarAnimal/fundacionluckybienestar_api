# Fundacion Lucky Bienestar API

Este backend esta hecho con:

```txt
NestJS
Supabase Auth
Supabase PostgreSQL
Supabase Storage
```

Todo el proyecto trabaja con la suite de Supabase

## 1. Antes De Correr El Proyecto

En Supabase ya esta preparado:

```txt
Proyecto Supabase
Base de datos PostgreSQL
Script SQL ejecutado
Tablas creadas
Roles y permisos creados
Administrador inicial creado
Bucket media-assets creado
```

Entonces si van a probar el backend:

```txt
No debe crear otro proyecto Supabase.
No debe ejecutar otro script desde cero.
No debe crear otro bucket.
Solo debe usar este backend con el .env correcto q les envie.
```

## 2. Para Que Sirve El .env

El archivo `.env` guarda las credenciales para que el backend se conecte a Supabase.

Debe tener:

```txt
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Sirve para:

```txt
conectarse al proyecto Supabase
hacer login y registro con Supabase Auth
consultar PostgreSQL
subir imagenes al bucket media-assets
crear usuarios desde el backend
```

Importante:

```txt
El .env no se sube a GitHub.
La clave SUPABASE_SERVICE_ROLE_KEY es privada.
```

## 3. Instalar Y Correr

Instalar dependencias:

```bash
npm install
```

Correr el backend:

```bash
npm run start:dev
```

La API queda en:

```txt
http://localhost:3000
```

## 4. Probar En Postman

Importar esta coleccion:

```txt
FUNDACION-LUCKY-BIENESTAR.postman_collection.json
```

Configurar la variable:

```txt
baseUrl = http://localhost:3000
```

Cuando vean algo como:

```txt
{{baseUrl}}/auth/login
```

Postman lo reemplaza por:

```txt
http://localhost:3000/auth/login
```

La coleccion esta dividida asi:

```txt
00 - TOKENS DE PRUEBA
01 - ADMIN CRM / BACKOFFICE
02 - PUBLIC USER / LANDING PAGE
```

## 5. Primer Paso En Postman

Primero usar:

```txt
00 - TOKENS DE PRUEBA
```

Aqui se obtienen tokens para probar:

```txt
usuario publico
administrador CRM
operador CRM
```

El token se copia y se usa en Authorization:

```txt
Bearer TOKEN_AQUI
```

Sin token, los endpoints protegidos devuelven:

```txt
401 Unauthorized
```

Si el usuario no tiene permiso, devuelve:

```txt
403 Forbidden
```

## 6. Usuarios Del Sistema

Hay tres tipos de usuarios:

```txt
admin
operator
public_user
```

### Admin

El admin ya debe existir en Supabase.

Sirve para entrar al CRM y administrar el sistema.

Puede:

```txt
crear operadores
administrar roles
administrar permisos
administrar avatares
administrar badges
administrar contenido del CRM
```

El admin inicial se crea en Supabase porque si no existe, nadie podria entrar al CRM por primera vez.

### Operator

El operador no se registra solo.

Lo crea el admin desde:

```txt
POST /admin/users/operators
```

Puede entrar al CRM, pero solo a modulos operativos.

### Public User

Es el usuario normal de la landing.

Se registra desde:

```txt
POST /auth/register
```

Puede:

```txt
ver la landing
actualizar su perfil
elegir avatar
enviar solicitud de adopcion
enviar solicitud de voluntariado
```

No entra al CRM.

## 7. Orden Para Probar Como Usuario Publico

En Postman ir a:

```txt
02 - PUBLIC USER / LANDING PAGE
```

Probar en este orden:

```txt
1. Registro usuario publico
2. Login usuario publico desde tokens o auth/login
3. Ver perfil usuario publico
4. Actualizar perfil propio
5. Consultar landing publica
6. Consultar publicaciones publicas
7. Consultar catalogo de animales
8. Enviar solicitud de adopcion
9. Enviar solicitud de voluntariado
```

El endpoint:

```txt
GET /auth/me
```

no necesita body.

El backend sabe que usuario consultar por el token.

## 8. Orden Para Probar  Admin U Operador

En Postman ir a:

```txt
01 - ADMIN CRM / BACKOFFICE
```

Primero obtener token de admin en:

```txt
00 - TOKENS DE PRUEBA
```

Luego probar los modulos del CRM.

### Solo Admin

Estas carpetas son solo para admin:

```txt
Usuarios CRM / Crear operador
Avatares de perfil
Badges
Badges de usuario
Roles
Permisos
```

### Admin/Operador

Estas carpetas las puede usar admin u operador:

```txt
Multimedia
Landing CRM
Publicaciones
Catalogo animales
Adopciones
Voluntariado
Contacto
Redes sociales
FAQ
```

## 9. Que Hace Cada Parte Del CRM

### Usuarios CRM

Sirve para que el admin cree operadores.

Cuando se crea un operador, se guarda en:

```txt
auth.users
profiles
user_roles
```

### Avatares

Son las imagenes que un usuario puede elegir para su perfil.

Tabla:

```txt
avatar_options
```

El perfil guarda el avatar con:

```txt
profiles.avatar_id
```

### Badges

Son insignias o reconocimientos.

Ejemplo:

```txt
Voluntario destacado
Adoptante responsable
Donador frecuente
```

Tablas:

```txt
badges
user_badges
```

### Roles Y Permisos

Sirven para controlar quien puede hacer cada cosa.

Tablas:

```txt
roles
permissions
role_permissions
```

Ejemplo:

```txt
admin tiene todos los permisos
operator tiene permisos operativos
public_user solo tiene permisos propios
```

### Multimedia

Sirve para subir imagenes.

La imagen real se guarda en:

```txt
Supabase Storage -> bucket media-assets
```

La informacion de la imagen se guarda en:

```txt
media_assets
```

### Landing

Sirve para administrar la pagina principal publica.

Tablas:

```txt
landing_sections
hero_cards
landing_impact_blocks
landing_info_cards
```

No es lo mismo que publicaciones.

Landing es para el contenido principal de la pagina.

### Publicaciones

Sirve para noticias, campanas, eventos o articulos.

Tablas:

```txt
publication_categories
publications
```

### Catalogo Animales

Sirve para administrar animales en adopcion.

Tablas:

```txt
animal_profiles
animal_images
animal_characteristics
```

### Adopciones

Sirve para manejar solicitudes de adopcion.

Tablas:

```txt
housing_types
adoption_applications
```

### Voluntariado

Sirve para manejar requisitos y solicitudes de voluntariado.

Tablas:

```txt
volunteer_requirements
volunteer_applications
volunteer_profiles
```

### Contacto, Redes Y FAQ

Sirve para informacion publica de la fundacion.

Tablas:

```txt
contact_info
social_links
faq_items
```

## 10. Imagenes

Las imagenes no se guardan directamente en PostgreSQL.

Se guardan asi:

```txt
archivo real -> Supabase Storage
datos del archivo -> media_assets
relacion con animales -> animal_images
relacion con landing/publicaciones -> mediaId
```

Ejemplo de URL:

```txt
https://rnawpguxsuquagvkeqoi.supabase.co/storage/v1/object/public/media-assets/avatars/avatar_dog.jpeg
```

## 11. Como Se Consulta La Base De Datos

No se usa ORM como Prisma o TypeORM.

Se usa:

```txt
@supabase/supabase-js
```

Las consultas estan en:

```txt
src/infrastructure/persistence/supabase/repositories
```

Ejemplos:

```txt
auth-supabase.ts
user-supabase.ts
media-supabase.ts
landing-supabase.ts
publication-supabase.ts
animal-supabase.ts
adoption-supabase.ts
volunteer-supabase.ts
settings-supabase.ts
identity-supabase.ts
```

El flujo del codigo es:

```txt
Controller
Use Case
Repository Port
Supabase Repository
Supabase
```

## 12. Resumen Para El Equipo

Para probar el proyecto:

```txt
1. Tener el .env correcto.
2. Ejecutar npm install.
3. Ejecutar npm run start:dev.
4. Importar FUNDACION-LUCKY-PRUEBA.postman_collection.json.
5. Configurar baseUrl = http://localhost:3000.
6. Obtener token en 00 - TOKENS DE PRUEBA.
7. Probar ADMIN CRM o PUBLIC USER segun corresponda.
```

Lo mas importante:

```txt
Admin y operador usan CRM.
Public user usa landing.
El token define quien es el usuario.
Los permisos definen que puede hacer.
Las imagenes van a Supabase Storage.
Los datos van a Supabase PostgreSQL.
```
