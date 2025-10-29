# Handmade Bags Store - Sistema de Gestión de Usuarios y Pedidos

Hola! Soy **Magdalena Inalaf G.**, desarrolladora full stack, y este es mi proyecto de evaluación de portafolio. He desarrollado una aplicación web completa para gestionar usuarios y pedidos de una tienda de handmade bags artesanales.

## Sobre el Proyecto

Esta aplicación web está desarrollada con **Node.js**, **Express**, **Sequelize** y **SQLite** para gestionar usuarios y pedidos de una tienda de handmade bags. Cada producto es único, hecho a mano con amor y dedicación artesanal. La aplicación implementa operaciones CRUD completas con transacciones y validaciones robustas.

## Características Implementadas

- **CRUD completo** para usuarios y pedidos
- **Base de datos SQLite** con Sequelize ORM
- **Transacciones** para garantizar consistencia de datos
- **Interfaz web** con Bootstrap 5 y tema pastel personalizado
- **Validaciones** robustas en frontend y backend
- **API REST** completa con documentación
- **Seeds** con datos de ejemplo para pruebas
- **Productos 100% hechos a mano** con diseños únicos
- **Búsqueda de productos** en tiempo real
- **Diseño responsive** para móviles y desktop

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: SQLite con Sequelize ORM
- **Frontend**: EJS, Bootstrap 5, CSS personalizado
- **Validación**: express-validator
- **Seguridad**: bcryptjs para hash de contraseñas
- **Logging**: morgan
- **Desarrollo**: nodemon

## Instalación y Configuración

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js 18+** ([Descargar aquí](https://nodejs.org/))
- **npm** (viene con Node.js)
- **Git** ([Descargar aquí](https://git-scm.com/))

### Opción 1: Instalación Local (Recomendada)

1. **Clonar el repositorio**
```bash
git clone https://github.com/MagdaIG/bags-shop-node-express.git
cd bags-shop-node-express
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
```

4. **Sincronizar la base de datos**
```bash
npm run db:sync
```

5. **Poblar la base de datos con datos de ejemplo**
```bash
npm run db:seed
```

6. **Iniciar la aplicación**
```bash
npm run dev
```

7. **Acceder a la aplicación**
```
http://localhost:3001
```

### Opción 2: Usando Docker (Alternativa)

Si prefieres usar Docker, también puedes ejecutar la aplicación con:

```bash
# Construir la imagen
docker build -t handmade-bags-store .

# Ejecutar el contenedor
docker run -p 3001:3001 handmade-bags-store
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor con nodemon

# Base de datos
npm run db:sync      # Sincroniza modelos con la BD
npm run db:seed      # Pobla la BD con datos de ejemplo

# Producción
npm start           # Inicia servidor en producción
```

## Estructura del Proyecto

```
bags-shop-node-express/
├── app.js                 # Aplicación principal
├── package.json           # Dependencias y scripts
├── .env                   # Variables de entorno
├── database.sqlite        # Base de datos SQLite
├── public/                # Archivos estáticos
│   ├── css/
│   │   └── theme.css      # Estilos personalizados
│   └── img/               # Imágenes de productos
├── views/                 # Plantillas EJS
│   ├── layout.ejs         # Layout principal
│   ├── index.ejs          # Página de inicio
│   ├── productos.ejs      # Catálogo de productos
│   ├── acerca.ejs         # Página "Acerca de"
│   ├── usuarios/          # Vistas de usuarios
│   └── pedidos/           # Vistas de pedidos
└── README.md              # Este archivo
```

## Base de Datos

### Modelos

#### Usuario
- `id` (INTEGER, PK, autoincrement)
- `nombre` (STRING, 2-60 caracteres)
- `email` (STRING, único, formato válido)
- `password` (STRING, hash bcrypt, min 8 caracteres, al menos 1 número)

#### Pedido
- `id` (INTEGER, PK, autoincrement)
- `usuario_id` (INTEGER, FK -> User.id)
- `producto` (STRING, 1-100 caracteres)
- `cantidad` (INTEGER, > 0)
- `fecha_pedido` (DATEONLY, default NOW())

### Asociaciones
```javascript
User.hasMany(Order, { foreignKey: 'usuario_id', onDelete: 'CASCADE' })
Order.belongsTo(User, { foreignKey: 'usuario_id' })
```

## API REST

### Usuarios

#### Crear Usuario
```bash
POST /api/usuarios
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "MiPassword123"
}
```

#### Obtener Todos los Usuarios
```bash
GET /api/usuarios
```

#### Obtener Usuario por ID
```bash
GET /api/usuarios/:id
```

#### Actualizar Usuario
```bash
PUT /api/usuarios/:id
Content-Type: application/json

{
  "nombre": "Juan Carlos Pérez",
  "email": "juancarlos@example.com"
}
```

#### Eliminar Usuario
```bash
DELETE /api/usuarios/:id
```

### Pedidos

#### Crear Pedido (con transacción)
```bash
POST /api/pedidos
Content-Type: application/json

{
  "usuario_id": 1,
  "producto": "Makeup Bag Lavender",
  "cantidad": 2
}
```

#### Obtener Todos los Pedidos
```bash
GET /api/pedidos
```

#### Obtener Pedidos de un Usuario
```bash
GET /api/pedidos/usuario/:id
```

## Productos Disponibles

- **Book Quilted Bag** ($39.00 CAD) - Bolso acolchado hecho a mano con diseño inspirado en libros
- **Drawstring Bag** ($31.00 CAD) - Bolso con cordón artesanal con técnicas tradicionales
- **Drawstring Minibag** ($21.00 CAD) - Mini bolso con cordón hecho a mano con diseño exclusivo
- **Laptop Quilted Bag** ($63.00 CAD) - Bolso acolchado artesanal especial para laptop
- **Makeup Bag Lavender** ($35.00 CAD) - Bolso de maquillaje hecho a mano en tono lavanda
- **Makeup Quilted** ($36.00 CAD) - Bolso de maquillaje acolchado artesanal con técnicas tradicionales
- **Mini Pouch** ($25.00 CAD) - Mini bolso hecho a mano con diseño exclusivo y único
- **Money Bag** ($28.00 CAD) - Bolso artesanal seguro para dinero con materiales premium
- **Round Bag** ($42.00 CAD) - Bolso redondo hecho a mano con diseño único y elegante
- **Scrunchies** ($11.00 CAD) - Colección de scrunchies hechos a mano con patrones exclusivos
- **Tote Bag** ($49.00 CAD) - Tote bag artesanal espacioso con técnicas tradicionales

## Interfaz Web

### Páginas Disponibles
- **/** - Página principal con productos destacados y historia artesanal
- **/productos** - Catálogo completo de productos artesanales
- **/acerca** - Historia de la tienda y perfil de la artesana
- **/usuarios** - Gestión de usuarios
- **/pedidos** - Gestión de pedidos
- **/usuarios/crear** - Formulario para crear usuario
- **/usuarios/:id/editar** - Formulario para editar usuario
- **/usuarios/:id/pedidos** - Pedidos de un usuario específico
- **/pedidos/crear** - Formulario para crear pedido

### Características de la UI
- **Tema pastel** personalizado con Bootstrap 5
- **Diseño responsive** para móviles y desktop
- **Validaciones en tiempo real** en formularios
- **Efectos hover** y animaciones suaves
- **Iconos Font Awesome** para mejor UX
- **Búsqueda de productos** en tiempo real

## Capturas de Pantalla

### Página Principal
![Página Principal](https://raw.githubusercontent.com/MagdaIG/bags-shop-node-express/master/public/images/readme/img/readme/homepage.png)
*Página de inicio con productos destacados y diseño artesanal*

### Catálogo de Productos
![Catálogo de Productos](https://raw.githubusercontent.com/MagdaIG/bags-shop-node-express/master/public/images/readme/img/readme/products.png)
*Catálogo completo con búsqueda en tiempo real*

### Gestión de Usuarios
![Gestión de Usuarios](https://raw.githubusercontent.com/MagdaIG/bags-shop-node-express/master/public/images/readme/img/readme/users.png)
*Interfaz para gestionar usuarios del sistema*

### Gestión de Pedidos
![Gestión de Pedidos](https://raw.githubusercontent.com/MagdaIG/bags-shop-node-express/master/public/images/readme/img/readme/orders.png)
*Sistema de gestión de pedidos con transacciones*

### Vista Móvil
![Vista Móvil](https://raw.githubusercontent.com/MagdaIG/bags-shop-node-express/master/public/images/readme/img/readme/mobile.png)
*Diseño responsive optimizado para dispositivos móviles*

## Validaciones y Seguridad

### Validaciones de Usuario
- Nombre: 2-60 caracteres, requerido
- Email: formato válido, único en la BD
- Password: mínimo 8 caracteres, al menos 1 número

### Validaciones de Pedido
- Usuario: debe existir en la BD
- Producto: 1-100 caracteres, requerido
- Cantidad: número entero mayor a 0

### Seguridad
- **Contraseñas hasheadas** con bcrypt (12 rounds)
- **Validación de entrada** con express-validator
- **Manejo de errores** robusto
- **Transacciones** para operaciones críticas

## Pruebas

### Datos de Ejemplo
La aplicación incluye datos de prueba:
- **3 usuarios** con contraseña `Bootcamp123`
- **5 pedidos** variados asignados a usuarios

### Probar con cURL

#### Crear Usuario
```bash
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María García",
    "email": "maria@example.com",
    "password": "MiPassword123"
  }'
```

#### Crear Pedido
```bash
curl -X POST http://localhost:3001/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "producto": "Makeup Bag Lavender",
    "cantidad": 2
  }'
```

#### Obtener Usuarios
```bash
curl http://localhost:3001/api/usuarios
```

#### Obtener Pedidos
```bash
curl http://localhost:3001/api/pedidos
```

## Cumplimiento de Requisitos

### Instalación y Configuración del Entorno
- [x] Node.js configurado
- [x] Sequelize como ORM instalado
- [x] Variables de entorno configuradas (.env)
- [x] Base de datos SQLite configurada

### Definición de Modelos con Sequelize
- [x] Modelo Usuario con campos: id, nombre, email, contraseña
- [x] Modelo Pedido con campos: id, usuario_id, producto, cantidad, fecha_pedido
- [x] Asociaciones: User.hasMany(Order), Order.belongsTo(User)
- [x] Validaciones: email único, contraseña con número, cantidad > 0

### Operaciones CRUD en la Base de Datos
- [x] POST /usuarios - Crear usuario
- [x] GET /usuarios - Obtener todos los usuarios
- [x] PUT /usuarios/:id - Actualizar usuario
- [x] DELETE /usuarios/:id - Eliminar usuario
- [x] POST /pedidos - Crear pedido
- [x] GET /usuarios/:id/pedidos - Obtener pedidos de usuario

### Operaciones Transaccionales
- [x] Transacción al crear pedido
- [x] Rollback automático si falla la inserción
- [x] Verificación de existencia del usuario
- [x] Uso correcto de sequelize.transaction()

### Pruebas y Verificación
- [x] API REST funcional y probada
- [x] Relaciones entre usuarios y pedidos implementadas
- [x] Pedidos solo se crean si el usuario existe
- [x] Documentación completa de ejecución y pruebas

## Funcionalidades Adicionales

- **Interfaz web completa** con navegación intuitiva
- **Catálogo de productos** con imágenes reales
- **Búsqueda de productos** en tiempo real
- **Efectos visuales** profesionales
- **Diseño responsive** para todos los dispositivos
- **Manejo de errores** con páginas personalizadas
- **Logging detallado** para debugging

## Solución de Problemas

### Error de Puerto en Uso
Si obtienes un error de puerto en uso:
```bash
# Cambiar el puerto en el archivo .env
PORT=3002
```

### Error de Base de Datos
Si hay problemas con la base de datos:
```bash
# Eliminar la base de datos y recrearla
rm database.sqlite
npm run db:sync
npm run db:seed
```

### Error de Dependencias
Si hay problemas con las dependencias:
```bash
# Limpiar e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
```

## Contribuciones

Este es un proyecto de evaluación de portafolio, pero si encuentras algún bug o tienes sugerencias, no dudes en contactarme.

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## Desarrolladora

**Magdalena Inalaf G.**
- Desarrolladora Full Stack
- GitHub: [https://github.com/MagdaIG](https://github.com/MagdaIG)
- LinkedIn: [https://www.linkedin.com/in/minalaf/](https://www.linkedin.com/in/minalaf/)
- Página Web: [https://inalaf.ca/](https://inalaf.ca/)
- Email: magda.inalaf@gmail.com

---

**¡Disfruta gestionando tu tienda de handmade bags artesanales!**

*Cada producto es único, hecho a mano con amor y dedicación artesanal.*
