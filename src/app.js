const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

// Importar rutas
const usersRoutes = require('./routes/users.routes');
const ordersRoutes = require('./routes/orders.routes');
const viewsRoutes = require('./routes/views.routes');

// Importar middleware
const { errorHandler, notFoundHandler, viewErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuraci√≥n de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware global
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(methodOverride('_method'));

// Archivos est√ticos
app.use(express.static(path.join(__dirname, '../public')));

// Middleware para pasar datos globales a las vistas
app.use((req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  res.locals.appName = 'Handmade Bags Store';
  next();
});

// Rutas API
app.use('/api/usuarios', usersRoutes);
app.use('/api/pedidos', ordersRoutes);

// Rutas de vistas
app.use('/', viewsRoutes);

// Middleware de manejo de errores
app.use(viewErrorHandler);
app.use(notFoundHandler);

// Funci√≥n para iniciar el servidor
const startServer = async () => {
  try {
    // Verificar conexi√≥n a la base de datos
    const { sequelize } = require('./db');
    await sequelize.authenticate();
    console.log('Success: Conexi√≥n a la base de datos establecida correctamente.');

    app.listen(PORT, () => {
      console.log(`Start: Servidor ejecut√ndose en http://localhost:${PORT}`);
      console.log(`Chart: Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`ó  Base de datos: ${process.env.DB_NAME || 'tienda_online'}`);
    });
  } catch (error) {
    console.error('Error: Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de se√ales de terminaci√≥n
process.on('SIGTERM', async () => {
  console.log(' Se√al SIGTERM recibida. Cerrando servidor...');
  const { closeConnection } = require('./db');
  await closeConnection();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log(' Se√al SIGINT recibida. Cerrando servidor...');
  const { closeConnection } = require('./db');
  await closeConnection();
  process.exit(0);
});

// Iniciar servidor si se ejecuta directamente
if (require.main === module) {
  startServer();
}

module.exports = app;
