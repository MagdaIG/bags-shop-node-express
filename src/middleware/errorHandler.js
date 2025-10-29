// Middleware para manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validaci贸n de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Errores de validaci贸n en la base de datos',
      errors
    });
  }

  // Error de restricci贸n 煤nica de Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'campo';
    return res.status(409).json({
      success: false,
      message: `El ${field} ya existe`,
      field: field
    });
  }

  // Error de clave for胣ea de Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inv胠ida en la base de datos',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Error de conexi贸n a la base de datos
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      success: false,
      message: 'Error de conexi贸n a la base de datos',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Error de sintaxis JSON
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'JSON inv胠ido en el cuerpo de la petici贸n'
    });
  }

  // Error 404 para rutas no encontradas
  if (err.status === 404) {
    return res.status(404).json({
      success: false,
      message: err.message || 'Recurso no encontrado'
    });
  }

  // Error 500 por defecto
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// Middleware para rutas no encontradas
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`
  });
};

// Middleware para manejo de errores en vistas EJS
const viewErrorHandler = (err, req, res, next) => {
  console.error('Error en vista:', err);

  // Si es una petici贸n AJAX, devolver JSON
  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    return errorHandler(err, req, res, next);
  }

  // Para vistas EJS, renderizar p胓ina de error
  res.status(err.status || 500).render('error', {
    title: 'Error',
    error: {
      status: err.status || 500,
      message: err.message || 'Error interno del servidor',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
  viewErrorHandler
};
