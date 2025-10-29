const express = require('express');
const router = express.Router();
const { User, Order } = require('../db');

// P�gina principal
router.get('/', async (req, res) => {
  try {
    // Obtener estadísticas b�sicas
    const totalUsers = await User.count();
    const totalOrders = await Order.count();
    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['nombre', 'email']
      }]
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
    console.error('Error en p�gina principal:', error);
    res.render('index', {
      title: 'Handmade Bags Store',
      stats: { totalUsers: 0, totalOrders: 0 },
      recentOrders: [],
      error: 'Error al cargar estadísticas'
    });
  }
});

// Vista de usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
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
    console.error('Error al cargar usuarios:', error);
    res.render('usuarios/index', {
      title: 'Gestión de Usuarios',
      users: [],
      error: 'Error al cargar usuarios'
    });
  }
});

// Vista de crear usuario
router.get('/usuarios/crear', (req, res) => {
  res.render('usuarios/crear', {
    title: 'Crear Usuario'
  });
});

// Vista de editar usuario
router.get('/usuarios/:id/editar', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

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
    console.error('Error al cargar usuario para editar:', error);
    res.render('error', {
      title: 'Error',
      error: { status: 500, message: 'Error al cargar usuario' }
    });
  }
});

// Vista de pedidos
router.get('/pedidos', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email']
      }],
      order: [['fecha_pedido', 'DESC'], ['createdAt', 'DESC']]
    });

    res.render('pedidos/index', {
      title: 'Gestión de Pedidos',
      orders
    });
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    res.render('pedidos/index', {
      title: 'Gestión de Pedidos',
      orders: [],
      error: 'Error al cargar pedidos'
    });
  }
});

// Vista de crear pedido
router.get('/pedidos/crear', async (req, res) => {
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
    console.error('Error al cargar usuarios para crear pedido:', error);
    res.render('pedidos/crear', {
      title: 'Crear Pedido',
      users: [],
      error: 'Error al cargar usuarios'
    });
  }
});

// Vista de pedidos de un usuario específico
router.get('/usuarios/:id/pedidos', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'nombre', 'email']
    });

    if (!user) {
      return res.status(404).render('error', {
        title: 'Usuario no encontrado',
        error: { status: 404, message: 'Usuario no encontrado' }
      });
    }

    const orders = await Order.findAll({
      where: { usuario_id: req.params.id },
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email']
      }],
      order: [['fecha_pedido', 'DESC'], ['createdAt', 'DESC']]
    });

    res.render('usuarios/pedidos', {
      title: `Pedidos de ${user.nombre}`,
      user,
      orders
    });
  } catch (error) {
    console.error('Error al cargar pedidos del usuario:', error);
    res.render('error', {
      title: 'Error',
      error: { status: 500, message: 'Error al cargar pedidos del usuario' }
    });
  }
});

// Vista de productos
router.get('/productos', (req, res) => {
  res.render('productos', {
    title: 'Cat�logo de Productos'
  });
});

// Vista de acerca de nosotros
router.get('/acerca', (req, res) => {
  res.render('acerca', {
    title: 'Acerca de Nosotros'
  });
});

module.exports = router;
