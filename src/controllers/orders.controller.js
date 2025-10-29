const { User, Order, sequelize } = require('../db');
const { validationResult } = require('express-validator');

// Crear un nuevo pedido con transacción
const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const { usuario_id, producto, cantidad, precio_unitario } = req.body;

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
      precio_unitario: precio_unitario || null,
      fecha_pedido: new Date().toISOString().split('T')[0]
    }, { transaction });

    // Commit de la transacción
    await transaction.commit();

    // Obtener el pedido con información del usuario
    const orderWithUser = await Order.findByPk(order.id, {
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: orderWithUser
    });

  } catch (error) {
    // Rollback en caso de error
    await transaction.rollback();
    console.error('Error al crear pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener todos los pedidos
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email']
      }],
      order: [['fecha_pedido', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      message: 'Pedidos obtenidos exitosamente',
      data: orders,
      count: orders.length
    });

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener pedidos de un usuario específico
const getOrdersByUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const user = await User.findByPk(id, {
      attributes: ['id', 'nombre', 'email']
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Obtener pedidos del usuario
    const orders = await Order.findAll({
      where: { usuario_id: id },
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email']
      }],
      order: [['fecha_pedido', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      message: `Pedidos del usuario ${user.nombre} obtenidos exitosamente`,
      data: {
        usuario: user,
        pedidos: orders,
        total_pedidos: orders.length
      }
    });

  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener un pedido por ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [{
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email']
      }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Pedido obtenido exitosamente',
      data: order
    });

  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Actualizar un pedido
const updateOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { producto, cantidad, precio_unitario, estado } = req.body;

    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const order = await Order.findByPk(id, { transaction });
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    // Actualizar el pedido
    await order.update({
      producto: producto || order.producto,
      cantidad: cantidad || order.cantidad,
      precio_unitario: precio_unitario !== undefined ? precio_unitario : order.precio_unitario,
      estado: estado || order.estado
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Pedido actualizado exitosamente',
      data: order
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Eliminar un pedido
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    await order.destroy();

    res.json({
      success: true,
      message: 'Pedido eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  updateOrder,
  deleteOrder
};
