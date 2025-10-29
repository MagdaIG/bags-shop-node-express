const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const bcrypt = require('bcryptjs');

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
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      name: 'email_unique',
      msg: 'Este email ya est√ registrado'
    },
    validate: {
      isEmail: {
        msg: 'Debe ser un email v√lido'
      },
      notEmpty: {
        msg: 'El email es requerido'
      }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [8, 255],
        msg: 'La contrase√a debe tener al menos 8 caracteres'
      },
      notEmpty: {
        msg: 'La contrase√a es requerida'
      },
      // Validaci√≥n personalizada para al menos un n√∫mero
      isStrongPassword(value) {
        if (value && !/\d/.test(value)) {
          throw new Error('La contrase√a debe contener al menos un n√∫mero');
        }
      }
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    }
  }
});

// M√©todo para comparar contrase√as
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// M√©todo para obtener datos sin contrase√a
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;
