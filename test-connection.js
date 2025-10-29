const { Sequelize } = require('sequelize');
require('dotenv').config();

async function testConnection() {
  console.log(' Probando conexión a PostgreSQL...');
  console.log('Configuración:', {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'tienda_online',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD ? '***' : 'no configurada'
  });

  const sequelize = new Sequelize({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'tienda_online',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    dialect: 'postgres',
    logging: false
  });

  try {
    await sequelize.authenticate();
    console.log('Success: �Conexión exitosa a PostgreSQL!');
    await sequelize.close();
  } catch (error) {
    console.log('Error: Error de conexión:', error.message);

    if (error.message.includes('password authentication failed')) {
      console.log('\nBulb: Soluciones posibles:');
      console.log('1. Verifica que la contrase�a en .env sea correcta');
      console.log('2. Asegúrate de que PostgreSQL esté ejecut�ndose');
      console.log('3. Verifica que el usuario "postgres" exista');
    }
  }
}

testConnection();
