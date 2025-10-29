# Tienda Online - Gestión de Usuarios y Pedidos

## Descripción del Proyecto

Esta es una aplicación web desarrollada en Node.js con Express, Sequelize y PostgreSQL para gestionar usuarios y pedidos de una tienda online de handmade bags. La aplicación implementa operaciones CRUD completas con transacciones y validaciones.

## Características Implementadas

### ✅ Base de Datos
- Conexión a PostgreSQL con Sequelize ORM
- Modelos User y Order con asociaciones (uno a muchos)
- Validaciones de datos en modelos y middleware
- Transacciones para mantener consistencia de datos
- Configuración de pool de conexiones

### ✅ Modelos de Datos

#### Usuario (User)
- `id`: Identificador único (auto-incremento)
- `nombre`: Nombre del usuario (2-60 caracteres)
- `email`: Email único con validación
- `password`: Contraseña encriptada con bcrypt (mínimo 8 caracteres, debe contener número)

#### Pedido (Order)
- `id`: Identificador único (auto-incremento)
- `usuario_id`: Referencia al usuario (clave foránea)
- `producto`: Nombre del producto (1-100 caracteres)
- `cantidad`: Cantidad del producto (1-100)
- `fecha_pedido`: Fecha del pedido
- `precio_unitario`: Precio por unidad (opcional)
- `estado`: Estado del pedido (pendiente, confirmado, en_proceso, enviado, entregado, cancelado)

### ✅ Operaciones CRUD

#### Usuarios
- `POST /api/usuarios` - Crear usuario
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

#### Pedidos
- `POST /api/pedidos` - Crear pedido (con transacción)
- `GET /api/pedidos` - Obtener todos los pedidos
- `GET /api/pedidos/:id` - Obtener pedido por ID
- `GET /api/pedidos/usuario/:id` - Obtener pedidos de un usuario
- `PUT /api/pedidos/:id` - Actualizar pedido
- `DELETE /api/pedidos/:id` - Eliminar pedido

### ✅ Validaciones
- Validación de email único
- Validación de contraseña segura
- Validación de datos de entrada con express-validator
- Validación de existencia de usuario al crear pedidos

### ✅ Transacciones
- Creación de pedidos con transacción
- Rollback automático en caso de error
- Verificación de existencia de usuario antes de crear pedido

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- PostgreSQL (versión 12 o superior)
- npm o yarn

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Base de Datos

#### Opción A: PostgreSQL Local
1. Instalar PostgreSQL en tu máquina
2. Crear la base de datos:
```sql
CREATE DATABASE tienda_online;
```

#### Opción B: PostgreSQL en la Nube (ElephantSQL)
1. Crear cuenta en [ElephantSQL](https://www.elephantsql.com/)
2. Crear una nueva instancia
3. Copiar la URL de conexión

### 3. Configurar Variables de Entorno

El archivo `.env` ya está configurado con valores por defecto. Si usas una base de datos diferente, modifica:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tienda_online
DB_USER=postgres
DB_PASSWORD=tu_password
```

### 4. Sincronizar Base de Datos
```bash
npm run db:sync
```

### 5. Poblar con Datos de Prueba (Opcional)
```bash
npm run db:seed
```

## Uso de la Aplicación

### Iniciar el Servidor
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor se ejecutará en `http://localhost:3000`

### Probar la Base de Datos
```bash
node test-database.js
```

## API Endpoints

### Crear Usuario
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Crear Pedido
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "producto": "Tote Bag",
    "cantidad": 2,
    "precio_unitario": 25.99
  }'
```

### Obtener Usuarios
```bash
curl http://localhost:3000/api/usuarios
```

### Obtener Pedidos de un Usuario
```bash
curl http://localhost:3000/api/pedidos/usuario/1
```

## Estructura del Proyecto

```
src/
├── app.js                 # Aplicación principal
├── config/
│   └── database.js        # Configuración de Sequelize
├── controllers/
│   ├── users.controller.js    # Controlador de usuarios
│   └── orders.controller.js   # Controlador de pedidos
├── db/
│   ├── index.js           # Configuración de modelos y asociaciones
│   ├── models/
│   │   ├── User.js        # Modelo de usuario
│   │   └── Order.js       # Modelo de pedido
│   ├── seed/
│   │   └── seed.js        # Datos de prueba
│   └── sync.js            # Sincronización de base de datos
├── middleware/
│   ├── errorHandler.js     # Manejo de errores
│   └── validators.js       # Validaciones de entrada
└── routes/
    ├── users.routes.js     # Rutas de usuarios
    ├── orders.routes.js    # Rutas de pedidos
    └── views.routes.js     # Rutas de vistas
```

## Características Técnicas

- **ORM**: Sequelize v6
- **Base de Datos**: PostgreSQL
- **Validación**: express-validator
- **Encriptación**: bcryptjs
- **Logging**: morgan
- **Vistas**: EJS
- **Estilos**: Bootstrap

## Manejo de Errores

La aplicación incluye manejo completo de errores:
- Validación de datos de entrada
- Manejo de errores de base de datos
- Respuestas JSON estructuradas
- Logging de errores en desarrollo

## Seguridad

- Contraseñas encriptadas con bcrypt
- Validación de entrada de datos
- Sanitización de datos
- Manejo seguro de errores

## Pruebas

Para verificar que todo funciona correctamente:

1. Ejecuta `node test-database.js` para probar la conexión y operaciones básicas
2. Usa Postman o curl para probar los endpoints de la API
3. Verifica que las transacciones funcionen correctamente

## Solución de Problemas

### Error de Conexión a Base de Datos
- Verifica que PostgreSQL esté ejecutándose
- Confirma las credenciales en `.env`
- Asegúrate de que la base de datos `tienda_online` existe

### Error de Validación
- Revisa que los datos cumplan con las validaciones
- Verifica que el email sea único
- Asegúrate de que la contraseña tenga al menos 8 caracteres y un número

### Error de Transacción
- Verifica que el usuario existe antes de crear un pedido
- Revisa los logs para identificar el error específico

## Contribución

Este proyecto fue desarrollado como parte de un bootcamp de programación, implementando todas las mejores prácticas de desarrollo con Node.js, Express y PostgreSQL.
