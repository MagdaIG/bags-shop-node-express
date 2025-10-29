const { User, Order, sequelize } = require('../db');
const { validationResult } = require('express-validator');

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    // Verificar errores de validaci√≥n
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validaci√≥n',
        errors: errors.array()
      });
    }

    const { nombre, email, password } = req.body;

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Este email ya est√ registrado'
      });
    }

    // Crear el usuario
    const user = await User.create({
      nombre,
      email,
      password
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: user
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: users,
      count: users.length
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Order,
        as: 'pedidos',
        order: [['fecha_pedido', 'DESC']]
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
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password } = req.body;

    // Verificar errores de validaci√≥n
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validaci√≥n',
        errors: errors.array()
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el email ya existe en otro usuario
    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [sequelize.Sequelize.Op.ne]: id }
        }
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Este email ya est√ registrado por otro usuario'
        });
      }
    }

    // Preparar datos para actualizar
    const updateData = {
      nombre: nombre || user.nombre,
      email: email || user.email
    };

    // Solo actualizar password si se proporciona
    if (password && password.trim() !== '') {
      updateData.password = password;
    }

    // Actualizar el usuario
    await user.update(updateData);

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Eliminar el usuario (esto tambi√©n eliminar√ sus pedidos por CASCADE)
    await user.destroy();

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
