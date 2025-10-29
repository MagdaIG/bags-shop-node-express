const { Sequelize } = require('sequelize');
require('dotenv').config();

async function testConnection() {
  console.log(' Probando conexi贸n a PostgreSQL...');
  console.log('Configuraci贸n:', {
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
    console.log('Success: 翪onexi贸n exitosa a PostgreSQL!');
    await sequelize.close();
  } catch (error) {
    console.log('Error: Error de conexi贸n:', error.message);

    if (error.message.includes('password authentication failed')) {
      console.log('\nBulb: Soluciones posibles:');
      console.log('1. Verifica que la contrase胊 en .env sea correcta');
      console.log('2. Aseg煤rate de que PostgreSQL est茅 ejecut胣dose');
      console.log('3. Verifica que el usuario "postgres" exista');
    }
  }
}

testConnection();
