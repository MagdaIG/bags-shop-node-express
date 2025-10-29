const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

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
      model: 'usuarios',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'El usuario es requerido'
      },
      isInt: {
        msg: 'El ID del usuario debe ser un n√∫mero entero'
      }
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
      },
      // Validaci√≥n para productos espec√≠ficos de handmade bags
      isValidProduct(value) {
        const validProducts = [
          'Book Quilted Bag',
          'Drawstring Bag',
          'Drawstring Minibag',
          'Laptop Quilted Bag',
          'Makeup Bag Lavender',
          'Makeup Quilted',
          'Mini Pouch',
          'Money Bag',
          'Round Bag',
          'Scrunchies',
          'Tote Bag',
          'Mini Bag Quilted'
        ];

        if (!validProducts.includes(value)) {
          console.warn(`ö  Producto personalizado: ${value}`);
        }
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
      max: {
        args: [100],
        msg: 'La cantidad no puede ser mayor a 100'
      },
      isInt: {
        msg: 'La cantidad debe ser un n√∫mero entero'
      },
      notNull: {
        msg: 'La cantidad es requerida'
      }
    }
  },
  fecha_pedido: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: {
        msg: 'La fecha debe ser v√lida'
      },
      notEmpty: {
        msg: 'La fecha del pedido es requerida'
      }
    }
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'El precio no puede ser negativo'
      }
    }
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmado', 'en_proceso', 'enviado', 'entregado', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendiente',
    validate: {
      isIn: {
        args: [['pendiente', 'confirmado', 'en_proceso', 'enviado', 'entregado', 'cancelado']],
        msg: 'Estado no v√lido'
      }
    }
  }
}, {
  tableName: 'pedidos',
  timestamps: true,
  indexes: [
    {
      fields: ['usuario_id']
    },
    {
      fields: ['fecha_pedido']
    },
    {
      fields: ['estado']
    }
  ]
});

// M√©todo para calcular el total del pedido
Order.prototype.getTotal = function() {
  if (this.precio_unitario && this.cantidad) {
    return parseFloat(this.precio_unitario) * this.cantidad;
  }
  return null;
};

// M√©todo para obtener el estado en espa√ol
Order.prototype.getEstadoEnEspanol = function() {
  const estados = {
    'pendiente': 'Pendiente',
    'confirmado': 'Confirmado',
    'en_proceso': 'En Proceso',
    'enviado': 'Enviado',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  };
  return estados[this.estado] || this.estado;
};

module.exports = Order;
