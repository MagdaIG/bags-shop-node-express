const sequelize = require('../config/database');
const User = require('./models/User');
const Order = require('./models/Order');

// Configurar asociaciones
User.hasMany(Order, {
  foreignKey: 'usuario_id',
  onDelete: 'CASCADE',
  as: 'pedidos'
});

Order.belongsTo(User, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

// Función para sincronizar la base de datos
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Success: Conexión a la base de datos establecida correctamente.');

    await sequelize.sync({ force: false });
    console.log('Success: Modelos sincronizados con la base de datos.');

    return true;
  } catch (error) {
    console.error('Error: Error al conectar con la base de datos:', error);
    return false;
  }
}

// Función para cerrar la conexión
async function closeConnection() {
  try {
    await sequelize.close();
    console.log('Success: Conexión a la base de datos cerrada.');
  } catch (error) {
    console.error('Error: Error al cerrar la conexión:', error);
  }
}

module.exports = {
  sequelize,
  User,
  Order,
  syncDatabase,
  closeConnection
};
