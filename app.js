const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Funciones de validación manuales
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 8 && /\d/.test(password);
};

const validateName = (name) => {
  return name && name.length >= 2 && name.length <= 60;
};

const validateProduct = (product) => {
  return product && product.length >= 1 && product.length <= 100;
};

const validateQuantity = (quantity) => {
  const num = parseInt(quantity);
  return !isNaN(num) && num > 0 && num <= 100;
};

// Configuración de Sequelize con SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false, // Desactivar logs de SQL para producción
  define: {
    timestamps: true,
    underscored: false,
  }
});

// Modelo Usuario
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: {
        args: [2, 60],
        msg: 'El nombre debe tener entre 2 y 60 caracteres'
      },
      notEmpty: {
        msg: 'El nombre es requerido'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Este email ya est� registrado'
    },
    validate: {
      isEmail: {
        msg: 'Debe ser un email v�lido'
      },
      notEmpty: {
        msg: 'El email es requerido'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [8, 255],
        msg: 'La contrase�a debe tener al menos 8 caracteres'
      },
      notEmpty: {
        msg: 'La contrase�a es requerida'
      },
      hasNumber(value) {
        if (!/\d/.test(value)) {
          throw new Error('La contrase�a debe contener al menos un número');
        }
      }
    }
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Modelo Pedido
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  producto: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: {
        args: [1, 100],
        msg: 'El producto debe tener entre 1 y 100 caracteres'
      },
      notEmpty: {
        msg: 'El producto es requerido'
      }
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'La cantidad debe ser mayor a 0'
      },
      isInt: {
        msg: 'La cantidad debe ser un número entero'
      }
    }
  },
  fecha_pedido: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

// Asociaciones
User.hasMany(Order, {
  foreignKey: 'usuario_id',
  onDelete: 'CASCADE',
  as: 'pedidos'
});
Order.belongsTo(User, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware global
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(methodOverride('_method'));

// Archivos est�ticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para pasar datos globales a las vistas
app.use((req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  res.locals.appName = 'Handmade Bags Store';
  next();
});

// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => error.message);
    if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors
      });
    }
    return res.status(400).render('error', {
      title: 'Error de Validación',
      error: { status: 400, message: errors.join(', ') }
    });
  }

  // Error de unicidad
  if (err.name === 'SequelizeUniqueConstraintError') {
    if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
      return res.status(409).json({
        success: false,
        message: 'Este email ya est� registrado'
      });
    }
    return res.status(409).render('error', {
      title: 'Email Duplicado',
      error: { status: 409, message: 'Este email ya est� registrado' }
    });
  }

  // Error genérico
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    return res.status(status).json({
      success: false,
      message
    });
  }

  res.status(status).render('error', {
    title: 'Error',
    error: { status, message }
  });
};

// Rutas de vistas
app.get('/', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalOrders = await Order.count();
    const recentOrders = await Order.findAll({
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.render('index', {
      title: 'Handmade Bags Store',
      stats: {
        totalUsers,
        totalOrders
      },
      recentOrders
    });
  } catch (error) {
    next(error);
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Order,
        as: 'pedidos',
        attributes: ['id', 'producto', 'cantidad', 'fecha_pedido']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.render('usuarios/index', {
      title: 'Gestión de Usuarios',
      users
    });
  } catch (error) {
    next(error);
  }
});

app.get('/usuarios/crear', (req, res) => {
  res.render('usuarios/crear', {
    title: 'Crear Usuario'
  });
});

app.get('/usuarios/:id/editar', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).render('error', {
        title: 'Usuario no encontrado',
        error: { status: 404, message: 'Usuario no encontrado' }
      });
    }
    res.render('usuarios/editar', {
      title: 'Editar Usuario',
      user
    });
  } catch (error) {
    next(error);
  }
});

app.get('/usuarios/:id/pedidos', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).render('error', {
        title: 'Usuario no encontrado',
        error: { status: 404, message: 'Usuario no encontrado' }
      });
    }

    const orders = await Order.findAll({
      where: { usuario_id: req.params.id },
      order: [['fecha_pedido', 'DESC']]
    });

    res.render('usuarios/pedidos', {
      title: `Pedidos de ${user.nombre}`,
      user,
      orders
    });
  } catch (error) {
    next(error);
  }
});

app.get('/pedidos', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email']
      }],
      order: [['fecha_pedido', 'DESC']]
    });

    res.render('pedidos/index', {
      title: 'Gestión de Pedidos',
      orders
    });
  } catch (error) {
    next(error);
  }
});

app.get('/pedidos/crear', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nombre', 'email'],
      order: [['nombre', 'ASC']]
    });

    res.render('pedidos/crear', {
      title: 'Crear Pedido',
      users
    });
  } catch (error) {
    next(error);
  }
});

app.get('/productos', (req, res) => {
  res.render('productos', {
    title: 'Cat�logo de Productos'
  });
});

// Validaciones
const userValidation = [
  body('nombre')
    .isLength({ min: 2, max: 60 })
    .withMessage('El nombre debe tener entre 2 y 60 caracteres')
    .notEmpty()
    .withMessage('El nombre es requerido'),
  body('email')
    .isEmail()
    .withMessage('Debe ser un email v�lido')
    .notEmpty()
    .withMessage('El email es requerido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contrase�a debe tener al menos 8 caracteres')
    .matches(/\d/)
    .withMessage('La contrase�a debe contener al menos un número')
];

const orderValidation = [
  body('usuario_id')
    .isInt({ min: 1 })
    .withMessage('Debe seleccionar un usuario v�lido'),
  body('producto')
    .isLength({ min: 1, max: 100 })
    .withMessage('El producto debe tener entre 1 y 100 caracteres')
    .notEmpty()
    .withMessage('El producto es requerido'),
  body('cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero mayor a 0')
];

// Rutas API
app.post('/api/usuarios', userValidation, async (req, res, next) => {
  try {
    // Validaciones manuales
    const errors = [];
    if (!validateName(req.body.nombre)) {
      errors.push('El nombre debe tener entre 2 y 60 caracteres');
    }
    if (!validateEmail(req.body.email)) {
      errors.push('El email debe tener un formato válido');
    }
    if (!validatePassword(req.body.password)) {
      errors.push('La contraseña debe tener al menos 8 caracteres y contener un número');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors
      });
    }

    const { nombre, email, password } = req.body;
    const user = await User.create({ nombre, email, password });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/usuarios', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: users,
      count: users.length
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/usuarios/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'nombre', 'email', 'createdAt'],
      include: [{
        model: Order,
        as: 'pedidos',
        attributes: ['id', 'producto', 'cantidad', 'fecha_pedido']
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario obtenido exitosamente',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

app.put('/api/usuarios/:id', userValidation, async (req, res, next) => {
  try {
    // Validaciones manuales
    const errors = [];
    if (!validateName(req.body.nombre)) {
      errors.push('El nombre debe tener entre 2 y 60 caracteres');
    }
    if (!validateEmail(req.body.email)) {
      errors.push('El email debe tener un formato válido');
    }
    if (!validatePassword(req.body.password)) {
      errors.push('La contraseña debe tener al menos 8 caracteres y contener un número');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors
      });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const { nombre, email, password } = req.body;
    await user.update({ nombre, email, password });

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/usuarios/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/pedidos', orderValidation, async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors.array().map(err => err.msg)
      });
    }

    const { usuario_id, producto, cantidad } = req.body;

    // Verificar que el usuario existe
    const user = await User.findByPk(usuario_id, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Crear el pedido dentro de la transacción
    const order = await Order.create({
      usuario_id,
      producto,
      cantidad,
      fecha_pedido: new Date().toISOString().split('T')[0]
    }, { transaction });

    // Commit de la transacción
    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: {
        id: order.id,
        usuario_id: order.usuario_id,
        producto: order.producto,
        cantidad: order.cantidad,
        fecha_pedido: order.fecha_pedido,
        usuario: {
          id: user.id,
          nombre: user.nombre,
          email: user.email
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

app.get('/api/pedidos', async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email']
      }],
      order: [['fecha_pedido', 'DESC']]
    });

    res.json({
      success: true,
      message: 'Pedidos obtenidos exitosamente',
      data: orders,
      count: orders.length
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/pedidos/usuario/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const orders = await Order.findAll({
      where: { usuario_id: req.params.id },
      order: [['fecha_pedido', 'DESC']]
    });

    res.json({
      success: true,
      message: `Pedidos del usuario ${user.nombre} obtenidos exitosamente`,
      data: {
        usuario: {
          id: user.id,
          nombre: user.nombre,
          email: user.email
        },
        pedidos: orders,
        total_pedidos: orders.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// Middleware de manejo de errores
app.use(errorHandler);

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`
  });
});

// Función para inicializar la base de datos
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Success: Conexión a la base de datos establecida correctamente');

    await sequelize.sync({ force: false });
    console.log('Success: Modelos sincronizados con la base de datos');

    // Crear datos de ejemplo si no existen
    const userCount = await User.count();
    if (userCount === 0) {
      console.log(' Creando datos de ejemplo...');

      const users = await User.bulkCreate([
        {
          nombre: 'Magdalena García',
          email: 'magda@example.com',
          password: 'Bootcamp123'
        },
        {
          nombre: 'Alice Johnson',
          email: 'alice@example.com',
          password: 'Bootcamp123'
        },
        {
          nombre: 'Bob Smith',
          email: 'bob@example.com',
          password: 'Bootcamp123'
        }
      ]);

      await Order.bulkCreate([
        {
          usuario_id: users[0].id,
          producto: 'Makeup Bag Lavender',
          cantidad: 2,
          fecha_pedido: '2024-01-15'
        },
        {
          usuario_id: users[0].id,
          producto: 'Tote Bag',
          cantidad: 1,
          fecha_pedido: '2024-01-20'
        },
        {
          usuario_id: users[1].id,
          producto: 'Mini Pouch',
          cantidad: 3,
          fecha_pedido: '2024-01-18'
        },
        {
          usuario_id: users[1].id,
          producto: 'Book Quilted Bag',
          cantidad: 1,
          fecha_pedido: '2024-01-22'
        },
        {
          usuario_id: users[2].id,
          producto: 'Laptop Quilted Bag',
          cantidad: 1,
          fecha_pedido: '2024-01-19'
        }
      ]);

      console.log('Success: Datos de ejemplo creados exitosamente');
    }

  } catch (error) {
    console.error('Error: Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

// Iniciar servidor
async function startServer() {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Start: Servidor ejecut�ndose en http://localhost:${PORT}`);
    console.log(`Chart: Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`� Base de datos: SQLite`);
    console.log(`\nSparkle: Características disponibles:`);
    console.log(`   Web: Interfaz web completa`);
    console.log(`   Bag: Productos artesanales con im�genes`);
    console.log(`   � Gestión de usuarios`);
    console.log(`   � Gestión de pedidos`);
    console.log(`   Info: Tema pastel personalizado`);
    console.log(`    Transacciones de base de datos`);
    console.log(`   Success: Validaciones completas`);
    console.log(`\n� Accede a: http://localhost:${PORT}`);
    console.log(`\nList: Endpoints API disponibles:`);
    console.log(`   POST /api/usuarios - Crear usuario`);
    console.log(`   GET /api/usuarios - Listar usuarios`);
    console.log(`   GET /api/usuarios/:id - Obtener usuario`);
    console.log(`   PUT /api/usuarios/:id - Actualizar usuario`);
    console.log(`   DELETE /api/usuarios/:id - Eliminar usuario`);
    console.log(`   POST /api/pedidos - Crear pedido`);
    console.log(`   GET /api/pedidos - Listar pedidos`);
    console.log(`   GET /api/pedidos/usuario/:id - Pedidos de usuario`);
  });
}

startServer().catch(console.error);

module.exports = app;
